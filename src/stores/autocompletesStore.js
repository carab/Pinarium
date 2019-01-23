import {extendObservable} from 'mobx';
import deburr from 'lodash/deburr';

import database from '../api/database';
import {makeStore, useCollection} from './utils';
import authStore from './auth';
import Autocomplete from '../models/autocomplete';

const autocompletesStore = extendObservable(
  makeStore(Autocomplete, 'autocompletes'),
  {
    async updateFrom(document, namespaces) {
      if (namespaces.length && authStore.user) {
        const collection = await this.collection();
        const batch = (await database).batch();

        const promises = namespaces
          .map(namespace => ({namespace, value: document[namespace]}))
          .filter(autocomplete => autocomplete.value)
          .map(async ({namespace, value}) => {
            const snapshot = await collection
              .where('namespace', '==', namespace)
              .where('value', '==', value)
              .get();

            if (snapshot.empty) {
              const autocomplete = {namespace, value, occurrences: 1};
              return collection.add(autocomplete);
            } else {
              // Supposedly one snapshot only...
              const doc = snapshot.docs.shift();
              const data = doc.data();

              return batch.update(doc.ref, {
                occurrences: data.occurrences + 1,
              });
            }
          });

        await Promise.all(promises);

        return batch.commit();
      }
    },
  },
  {}
);

export default autocompletesStore;

export function useAutocompletes() {
  return useCollection(autocompletesStore);
}

export function useAutocompleteSuggestions(namespace) {
  const [suggestions] = useCollection(
    autocompletesStore,
    namespace,
    collectionRef => collectionRef.where('namespace', '==', namespace)
  );

  return value => {
    const inputValue = clean(value);
    const inputLength = inputValue ? inputValue.length : 0;
    let count = 0;

    return inputLength === 0 || !suggestions
      ? []
      : suggestions.filter(suggestion => {
          const keep =
            count < 5 &&
            clean(suggestion.value.slice(0, inputLength)) === inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
  };
}

// export async function useSuggestions(namespace) {
//   const suggestions = useObservable([])

//   const db = await database
//   const snapshot = await db
//     .collection('users')
//     .doc(authStore.user.uid)
//     .collection('autocompletes')
//     .where('namespace', '==', namespace)
//     .get()

//   snapshot.forEach(doc => {
//     suggestions.push(doc.data())
//   })

//   return suggestions
// }

export function clean(value) {
  if (value) {
    return deburr(value.trim()).toLowerCase();
  }
}
