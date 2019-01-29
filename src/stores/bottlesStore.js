import {useMemo, useEffect} from 'react';
import {extendObservable, action} from 'mobx';

import uid from '../lib/uid';
import firebase from '../api/firebase';
import storageApi from '../api/storageApi';
import Bottle from '../models/bottle';
import {useCollection, useDocument, makeStore} from './utils';
import auth from './auth';
import logsStore from './logsStore';
import searchStore from './searchStore';

const bottlesStore = extendObservable(
  makeStore(Bottle, 'bottles'),
  {
    async preSave(data) {
      if (!auth.user) {
        return data;
      }

      // Upload etiquette if specified
      if (data.etiquette instanceof File || data.etiquette instanceof Blob) {
        const path = `users/${auth.user.uid}/etiquettes/${uid()}`;

        await storageApi.child(path).put(data.etiquette);
        data.etiquette = path;
      }

      return data;
    },
    // Selection
    selected: {},
    get selectedBottles() {
      const ids = Object.keys(this.selected);
      const bottles = this.currentBottles ? this.currentBottles : [];
      return bottles.filter(bottle => ids.indexOf(bottle.$ref.id) !== -1);
    },
    isSelected(bottle) {
      return Boolean(this.selected[bottle.$ref.id]);
    },
    select(bottles) {
      if (bottles) {
        bottles.forEach(bottle => {
          this.selected[bottle.$ref.id] = true;
        });
      } else if (this.currentBottles) {
        this.currentBottles.forEach(bottle => {
          this.selected[bottle.$ref.id] = true;
        });
      }
    },
    unselect(bottles) {
      if (bottles) {
        bottles.forEach(bottle => {
          delete this.selected[bottle.$ref.id];
        });
      } else {
        this.selected = {};
      }
    },

    async addLogs(bottleRefs, logRefs, data = {}) {
      data.logs = firebase.firestore.FieldValue.arrayUnion(...logRefs);
      return this.update(bottleRefs, data);
    },

    async removeLogs(bottleRefs, logRefs, data = {}) {
      data.logs = firebase.firestore.FieldValue.arrayRemove(...logRefs);
      return this.update(bottleRefs, data);
    },

    /**
     * Update the given bottles, by applying all the logs of each bottle (including the given one).
     *
     * @param {Log} log
     */
    async updateFromLogs(bottleRefs) {
      const batch = await this.batch();

      const promises = bottleRefs.map(async bottleRef => {
        // First fetch bottle logs
        const snapshot = await logsStore.getByBottle(bottleRef);

        if (!snapshot.empty) {
          // Initial data is empty to clean values that may have been deleted
          const data = {
            cellar: null,
            shelve: null,
            reference: null,
            status: null,
            rating: null,
            inDate: null,
            outDate: null,
            buyingPrice: null,
            sellingPrice: null,
          };

          // Apply each log to the data
          snapshot.docs
            .map(doc => doc.data())
            .forEach(log =>
              MAPPINGS.forEach(({si, alors}) => si(log) && alors(log, data))
            );

          return batch.update(bottleRef, data);
        }
      });

      await Promise.all(promises);

      return batch.commit();
    },
  },
  {
    select: action,
    unselect: action,
  }
);

export default bottlesStore;

export function useBottles() {
  const {visibility} = searchStore;

  const name =
    undefined === visibility ? 'all' : visibility ? 'stocked' : 'unstocked';

  const filter = useMemo(
    function() {
      if (undefined === visibility) {
        return collectionRef => collectionRef;
      }

      return collectionRef => collectionRef.where('stocked', '==', visibility);
    },
    [visibility]
  );

  const [bottles, ...rest] = useCollection(bottlesStore, name, filter);

  useEffect(() => {
    bottlesStore.currentBottles = bottles;
  }, [bottles]);

  return [bottles, ...rest];
}

export function useBottle($ref) {
  return useDocument(bottlesStore, $ref);
}

const MAPPINGS = [
  {
    si: log => Boolean(log.status),
    alors: (log, data) => (data.status = log.status),
  },
  {
    si: log =>
      Boolean(log.cellar) &&
      ['received', 'bought', 'moved'].indexOf(log.status) >= 0,
    alors: (log, data) => (data.cellar = log.cellar),
  },
  {
    si: log =>
      Boolean(log.when) && ['received', 'bought'].indexOf(log.status) >= 0,
    alors: (log, data) => (data.inDate = log.when),
  },
  {
    si: log =>
      Boolean(log.when) && ['given', 'sold', 'drank'].indexOf(log.status) >= 0,
    alors: (log, data) => (data.outDate = log.when),
  },
  {
    si: log => Boolean(log.price) && ['bought'].indexOf(log.status) >= 0,
    alors: (log, data) => (data.buyingPrice = log.price),
  },
  {
    si: log => Boolean(log.price) && ['sold'].indexOf(log.status) >= 0,
    alors: (log, data) => (data.sellingPrice = log.price),
  },
  {
    si: log => Boolean(log.rating) && ['drank'].indexOf(log.status) >= 0,
    alors: (log, data) => (data.rating = log.rating),
  },
  {
    si: log => true,
    alors: (log, data) =>
      (data.stocked = ['drank', 'given', 'sold'].indexOf(log.status) === -1),
  },
];
