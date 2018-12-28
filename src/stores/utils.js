import {useEffect} from 'react'
import {observable, action, autorun} from 'mobx'
import {useObservable} from 'mobx-react-lite'

import firebase from '../api/firebase'
import database from '../api/database'
import auth from './auth'
import autocompletesStore from './autocompletesStore'

export function createDocument(model, data) {
  const document = {...model, ...data}

  Object.keys(document).forEach(field => {
    if (document[field] instanceof firebase.firestore.Timestamp) {
      document[field] = document[field].toDate()
    }
  })

  return document
}

export function makeStore(model, subcollection = null, autocompletes = []) {
  const store = observable.object(
    {
      name: subcollection ? subcollection : 'user',
      documents: {},
      all: [],
      ready: false,
      subscribers: 0,
      create() {
        return observable({...model})
      },
      observe(bag) {
        return snapshot => {
          snapshot.docChanges().forEach(change => {
            bag.ready = true
            switch (change.type) {
              case 'added':
              case 'modified': {
                const index = bag.all.findIndex(
                  document => document.$ref.id === change.doc.ref.id
                )

                const document = createDocument(model, change.doc.data())
                document.$ref = change.doc.ref

                if (index >= 0) {
                  bag.all[index] = document
                } else {
                  bag.all.push(document)
                }

                break
              }

              case 'removed': {
                const index = bag.all.findIndex(
                  document => document.$ref.id === change.doc.ref.id
                )

                if (index >= 0) {
                  bag.all.splice(index, 1)
                }

                break
              }

              default:
            }
          })
        }
      },
      subscribe() {
        this.subscribers++
        return () => this.subscribers--
      },
      async collection() {
        if (!auth.user) {
          return null
        }

        const collection = (await database).collection('users')

        if (subcollection) {
          return collection.doc(auth.user.uid).collection(subcollection)
        }

        return collection
      },
      async listenCollection(bag, filter = collectionRef => collectionRef) {
        const collectionRef = await this.collection()
        return filter(collectionRef).onSnapshot(this.observe(bag))
      },
      async listenDocument($ref, bag) {
        if (!($ref instanceof firebase.firestore.DocumentReference)) {
          const id = $ref
          $ref = (await store.collection()).doc(id)
        }

        bag.subscribed = true
        const unsubscribe = $ref.onSnapshot(this.handleDocument(bag))

        return () => {
          unsubscribe()
          bag.subscribed = false
        }
      },
      handleDocument(bag) {
        return snapshot => {
          const document = createDocument(model, snapshot.data())
          document.$ref = snapshot.ref
          bag.document = document
          bag.ready = true
        }
      },
      async save({$ref, ...document}) {
        const collection = await this.collection()

        if ($ref) {
          document.updateDate = firebase.firestore.FieldValue.serverTimestamp()
          await $ref.set(document)
        } else {
          document.creationDate = firebase.firestore.FieldValue.serverTimestamp()
          $ref = await collection.add(document)
        }

        autocompletesStore.updateFrom(document, autocompletes)

        return $ref
      },
      async update($refs, data) {
        const batch = (await database).batch()
        $refs.forEach($ref => {
          // $refs is either the expected document reference, or the document which included its $ref
          if (!($ref instanceof firebase.firestore.DocumentReference)) {
            const document = $ref
            $ref = document.$ref
          }
          batch.update($ref, data)
        })
        return batch.commit()
      },
      async delete($refs) {
        const batch = (await database).batch()
        $refs.forEach($ref => batch.delete($ref))
        return batch.commit()
      },
    },
    {
      observe: action.bound,
      handleDocument: action.bound,
      save: action,
      create: action,
      update: action,
      subscribe: action,
    }
  )

  let promise
  autorun(function start() {
    if (!auth.user) {
      return
    }

    // Only listen to firebase for the first subscriber
    if (store.subscribers !== 1) {
      return
    }

    promise = store.listenCollection(store)
  })

  autorun(function stop() {
    // Only stop listening when there is no more subscriber
    if (store.subscribers > 0) {
      return
    }

    if (promise) {
      promise.then(unsubscribe => unsubscribe())
    }
  })

  return store
}

export function useCollection(store, filter) {
  const bag = useObservable(filter ? {all: [], ready: false} : store)

  useEffect(
    () => {
      if (filter) {
        //const filter = collectionRef => collectionRef // @todo how to filter in $refs ?
        const promise = store.listenCollection(bag, filter)
        return () => {
          promise.then(unsubscribe => unsubscribe())
        }
      }

      const unsubscribe = store.subscribe()
      return unsubscribe
    },
    [auth.user, filter]
  )

  return bag.all
}

export function useDocument(store, $ref) {
  const id = $ref && $ref.id ? $ref.id : $ref

  const bag = useObservable(
    store.documents[id]
      ? store.documents[id]
      : {
          ready: id ? false : true,
          subscribed: id ? false : true,
          document: id ? null : store.create(),
        }
  )

  store.documents[id] = bag

  useEffect(
    () => {
      if (!bag.subscribed) {
        const unsubscribing = store.listenDocument(id, bag)
        return () => {
          unsubscribing.then(unsubscribe => {
            unsubscribe()
          })
        }
      }
    },
    [id]
  )

  return [bag.document, bag.ready, bag.subscribed]
}
