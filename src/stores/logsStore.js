import {observable, extendObservable} from 'mobx';

import firebase from '../api/firebase';
import Log from '../models/log';
import statusesDef from '../enums/statuses';
import {makeStore, useCollection, useDocument} from './utils';

const logsStore = extendObservable(makeStore(Log, 'logs'), {
  createFrom(template) {
    const log = this.create();

    log.when = template.when ? template.when : new Date();
    log.status = template.status;

    // Specific status behavior
    const statusDef = statusesDef.find(
      statusDef => statusDef.name === log.status
    );

    if (statusDef && statusDef.fields.indexOf('cellar') > -1) {
      log.cellar = template.cellar;
    }

    // Bottles filter
    log.bottles = template.bottles;

    return observable(log);
  },

  async addBottles(logRefs, bottleRefs, data = {}) {
    data.bottles = firebase.firestore.FieldValue.arrayUnion(...bottleRefs);
    return this.update(logRefs, data);
  },

  async removeBottles(logRefs, bottleRefs, data = {}) {
    data.bottles = firebase.firestore.FieldValue.arrayRemove(...bottleRefs);
    return this.update(logRefs, data);
  },

  async getByBottle(bottleRef) {
    const collectionRef = await this.collection();
    return this.addBottleFilter(collectionRef, bottleRef).get();
  },

  addBottleFilter(collectionRef, bottleRef) {
    return collectionRef
      .where('bottles', 'array-contains', bottleRef)
      .orderBy('when');
  },
});

export default logsStore;

// export function useLogs() {
//   return useCollection(logs)
// }

export function useBottleLogs(bottleRef) {
  return useCollection(logsStore, bottleRef.id, collectionRef =>
    logsStore.addBottleFilter(collectionRef, bottleRef)
  );
}

export function useLog($ref) {
  return useDocument(logsStore, $ref);
}
