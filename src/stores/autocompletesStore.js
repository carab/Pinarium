import {observable, action} from 'mobx'
import {useObservable} from 'mobx-react-lite'
import deburr from 'lodash/deburr'

import database from '../api/database'
import authStore from './auth'

const autocompletesStore = observable.object(
  {
    suggestions: {},
    getSuggestions(value, namespace) {
      const inputValue = clean(value)
      const inputLength = inputValue ? inputValue.length : 0
      let count = 0

      return inputLength === 0 || !this.suggestions[namespace]
        ? []
        : this.suggestions[namespace].filter(suggestion => {
            const keep =
              count < 5 &&
              clean(suggestion.label.slice(0, inputLength)) === inputValue

            if (keep) {
              count += 1
            }

            return keep
          })
    },
    async updateFrom(document, namespaces) {
      if (namespaces.length && authStore.user) {
        const db = await database
        const collection = db
          .collection('users')
          .doc(authStore.user.uid)
          .collection('autocompletes')
        const batch = db.batch()

        const promises = namespaces
          .map(namespace => ({namespace, value: document[namespace]}))
          .filter(autocomplete => autocomplete.value)
          .map(async ({namespace, value}) => {
            const snapshot = await collection
              .where('namespace', '==', namespace)
              .where('value', '==', value)
              .get()

            if (snapshot.empty) {
              const autocomplete = {namespace, value, occurrences: 1}
              return collection.add(autocomplete)
            } else {
              // Supposedly one snapshot only...
              const doc = snapshot.docs[0]
              const data = doc.data()

              return batch.update(doc.ref, {
                occurrences: data.occurrences + 1,
              })
            }
          })

        await Promise.all(promises)

        return batch.commit()
      }
    },
    async loadSuggestions(namespace) {
      const suggestions = []

      const db = await database
      const snapshot = await db
        .collection('users')
        .doc(authStore.user.uid)
        .collection('autocompletes')
        .where('namespace', '==', namespace)
        .get()

      snapshot.forEach(doc => {
        suggestions.push({label: doc.data().value})
      })

      this.suggestions[namespace] = suggestions
    },
  },
  {
    loadSuggestions: action,
  }
)

export default autocompletesStore

export async function useSuggestions(namespace) {
  const suggestions = useObservable([])

  const db = await database
  const snapshot = await db
    .collection('users')
    .doc(authStore.user.uid)
    .collection('autocompletes')
    .where('namespace', '==', namespace)
    .get()

  snapshot.forEach(doc => {
    suggestions.push(doc.data())
  })

  return suggestions
}

function clean(value) {
  if (value) {
    return deburr(value.trim()).toLowerCase()
  }
}
