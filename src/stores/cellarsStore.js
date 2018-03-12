import {store} from 'react-easy-state'

import {subscribe, unsubscribe, save} from './utils'
import {saveCellar, fetchCellar, onCellarsRefresh} from '../api/cellarApi'

const cellarsStore = store({
  all: {},
  get list() {
    return Object.values(cellarsStore.all)
  },
  initial() {
    return {
      name: null,
      description: null,
      shelves: [],
    }
  },
  find(id) {
    return cellarsStore.all[id]
  },
  fetch(id) {
    return fetchCellar(id)
  },
  save(cellar) {
    return save(saveCellar, cellar)
  },
  on() {
    subscribe(onCellarsRefresh, cellarsStore)
  },
  off() {
    unsubscribe(cellarsStore)
  },
})

export default cellarsStore
