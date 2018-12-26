import {useEffect} from 'react'
import {observer} from 'mobx-react-lite'

import autocompletesStore from '../stores/autocompletesStore'

export default observer(function AutocompleteSuggestions({
  namespace,
  search,
  renderSuggestion,
}) {
  const suggestions = autocompletesStore.getSuggestions(search, namespace)

  useEffect(
    () => {
      autocompletesStore.loadSuggestions(namespace)
      return () => {}
    },
    [namespace]
  )

  return suggestions.map(renderSuggestion)
})

// function getSuggestions(value) {
//   const inputValue = deburr(value.trim()).toLowerCase()
//   const inputLength = inputValue.length
//   let count = 0

//   return inputLength === 0
//     ? []
//     : suggestions.filter(suggestion => {
//         const keep =
//           count < 5 &&
//           suggestion.label.slice(0, inputLength).toLowerCase() === inputValue

//         if (keep) {
//           count += 1
//         }

//         return keep
//       })
// }
