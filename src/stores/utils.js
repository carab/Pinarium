import {observable, action, autorun} from 'mobx'
import {useEffect} from 'react'
import {useObservable} from 'mobx-react-lite'

import firebase from '../api/firebase'
import database from '../api/database'
import auth from './auth'

export function createDocument(model, data) {
  const document = {...model, ...data}

  Object.keys(document).forEach(field => {
    if (document[field] instanceof firebase.firestore.Timestamp) {
      document[field] = document[field].toDate()
    }
  })

  return document
}

export function makeStore(model, subcollection) {
  const store = observable.object(
    {
      all: [],
      subscribers: 0,
      create() {
        return observable({...model})
      },
      observe(target) {
        return snapshot => {
          snapshot.docChanges().forEach(change => {
            switch (change.type) {
              case 'added':
              case 'modified': {
                const index = target.findIndex(
                  document => document.$ref.id === change.doc.ref.id
                )

                const document = createDocument(model, change.doc.data())
                document.$ref = change.doc.ref

                if (index >= 0) {
                  target[index] = document
                } else {
                  target.push(document)
                }

                break
              }

              case 'removed': {
                const index = target.findIndex(
                  document => document.$ref.id === change.doc.ref.id
                )

                if (index >= 0) {
                  target.splice(index, 1)
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
      async listenCollection(
        target,
        addFilter = collectionRef => collectionRef
      ) {
        return addFilter(await store.collection()).onSnapshot(
          store.observe(target)
        )
      },
      async listenDocument($ref, target) {
        if (!($ref instanceof firebase.firestore.DocumentReference)) {
          const id = $ref
          $ref = (await store.collection()).doc(id)
        }

        return $ref.onSnapshot(doc => {
          const document = createDocument(model, doc.data())
          document.$ref = doc.ref
          target.document = document
        })
      },
      async save({$ref, ...document}, id) {
        const collection = await this.collection()

        if (id || $ref) {
          document.updateDate = firebase.firestore.FieldValue.serverTimestamp()
          return collection.doc(id || $ref.id).set(document)
        }

        document.creationDate = firebase.firestore.FieldValue.serverTimestamp()
        return collection.add(document)
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

    promise = store.listenCollection(store.all)
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

export function useCollection(store, $refs) {
  const collection = useObservable($refs ? [] : store.all)

  useEffect(
    () => {
      if ($refs) {
        const filter = collectionRef => collectionRef // @todo how to filter in $refs ?
        const promise = store.listenCollection(collection, filter)
        return () => {
          promise.then(unsubscribe => unsubscribe())
        }
      }

      const unsubscribe = store.subscribe()
      return unsubscribe
    },
    [auth.user, $refs]
  )

  return collection
}

export function useDocument(store, $ref) {
  const target = useObservable({document: $ref ? null : store.create()})

  useEffect(
    () => {
      if ($ref) {
        const promise = store.listenDocument($ref, target)
        return () => {
          promise.then(unsubscribe => unsubscribe())
        }
      }
    },
    [auth.user, $ref]
  )

  return target.document
}
