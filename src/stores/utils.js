import {useEffect} from 'react';
import {observable, action, autorun} from 'mobx';
import {useObservable} from 'mobx-react-lite';

import firebase from '../api/firebase';
import database from '../api/database';
import auth from './auth';

export function createDocument(model, data) {
  const document = {...model, ...data};

  Object.keys(document).forEach(field => {
    if (document[field] instanceof firebase.firestore.Timestamp) {
      document[field] = document[field].toDate();
    }
  });

  return document;
}

export function makeStore(model, subcollection = null) {
  const store = observable.object(
    {
      name: subcollection ? subcollection : 'user',
      documents: {},
      collections: {},
      create() {
        return {...model};
      },
      async collection() {
        if (!auth.user) {
          return null;
        }

        const collection = (await database).collection('users');

        if (subcollection) {
          return collection.doc(auth.user.uid).collection(subcollection);
        }

        return collection;
      },
      async listenCollection(target, filter) {
        target.subscribed = true;

        const collectionRef = await this.collection();

        const unsubscribe = filter(collectionRef)
          // .orderBy('inDate')
          // .limit(10)
          .onSnapshot(
            action(snapshot => {
              target.ready = true;
              snapshot.docChanges().forEach(change => {
                switch (change.type) {
                  case 'added':
                  case 'modified': {
                    const index = target.collection.findIndex(
                      document => document.$ref.id === change.doc.ref.id
                    );

                    const document = createDocument(model, change.doc.data());
                    document.$ref = change.doc.ref;

                    if (index >= 0) {
                      target.collection[index] = document;
                    } else {
                      target.collection.push(document);
                    }

                    break;
                  }

                  case 'removed': {
                    const index = target.collection.findIndex(
                      document => document.$ref.id === change.doc.ref.id
                    );

                    if (index >= 0) {
                      target.collection.splice(index, 1);
                    }

                    break;
                  }

                  default:
                }
              });
            })
          );

        return action(() => {
          unsubscribe();
          target.subscribed = false;
        });
      },
      async listenDocument($ref, target) {
        target.subscribed = true;

        if (!($ref instanceof firebase.firestore.DocumentReference)) {
          const id = $ref;
          $ref = (await store.collection()).doc(id);
        }

        const unsubscribe = $ref.onSnapshot(
          action(snapshot => {
            const document = createDocument(model, snapshot.data());
            document.$ref = snapshot.ref;
            target.document = document;
            target.ready = true;
          })
        );

        return action(() => {
          unsubscribe();
          target.subscribed = false;
        });
      },
      async save({$ref, ...document}) {
        const collection = await this.collection();

        if ($ref) {
          document.updateDate = firebase.firestore.FieldValue.serverTimestamp();
          await $ref.set(document);
        } else {
          document.creationDate = firebase.firestore.FieldValue.serverTimestamp();
          $ref = await collection.add(document);
        }

        return $ref;
      },
      async update($refs, data) {
        const batch = await this.batch();
        $refs.forEach($ref => {
          // $refs is either the expected document reference, or the document which included its $ref
          if (!($ref instanceof firebase.firestore.DocumentReference)) {
            const document = $ref;
            $ref = document.$ref;
          }
          batch.update($ref, data);
        });
        return batch.commit();
      },
      async delete($refs) {
        const batch = await this.batch();
        $refs.forEach($ref => batch.delete($ref));
        return batch.commit();
      },
      async batch() {
        const batch = (await database).batch();
        return batch;
      },
    },
    {
      listenCollection: action,
      listenDocument: action,
      save: action,
      create: action,
      update: action,
    }
  );

  return store;
}

function defaultFilter(collectionRef) {
  return collectionRef;
}

export function useCollection(store, name = 'all', filter = defaultFilter) {
  const state = useObservable({
    target: {
      ready: false,
      subscribed: false,
      collection: [],
    },
  });
  // const state = useObservable(
  //   store.collections[name]
  //     ? store.collections[name]
  //     : {
  //         name,
  //         ready: false,
  //         subscribed: false,
  //         collection: [],
  //       }
  // )
  // if (!store.collections[name]) {
  //   store.collections[name] = state
  // }

  useEffect(() => {
    if (!store.collections[name]) {
      store.collections[name] = {
        ready: false,
        subscribed: false,
        collection: [],
      };
    }

    state.target = store.collections[name];

    if (!state.target.subscribed) {
      console.log(`subscribing ${store.name}`);
      const unsubscribing = store.listenCollection(state.target, filter);
      return () => {
        unsubscribing.then(unsubscribe => {
          unsubscribe();
        });
      };
    }
  }, [auth.user, name]);

  return [state.target.collection, state.target.ready, state.target.subscribed];
}

export function useDocument(store, $ref) {
  const id = $ref && $ref.id ? $ref.id : $ref;

  const target = useObservable(
    id
      ? store.documents[id]
        ? store.documents[id]
        : {
            ready: false,
            subscribed: false,
            document: null,
          }
      : {
          ready: true,
          subscribed: true,
          document: store.create(),
        }
  );

  if (id && !store.documents[id]) {
    store.documents[id] = target;
  }

  useEffect(() => {
    if (!target.subscribed) {
      const unsubscribing = store.listenDocument(id, target);
      return () => {
        unsubscribing.then(unsubscribe => {
          unsubscribe();
        });
      };
    }
  }, [id]);

  return [target.document, target.ready, target.subscribed];
}
