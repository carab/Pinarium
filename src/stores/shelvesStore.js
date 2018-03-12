import {store} from 'react-easy-state'

import {subscribe, unsubscribe, save} from './utils'
import {onShelvesRefresh, saveShelve, fetchShelve} from '../api/shelveApi'

const shelvesStore = store({
  all: {},
  get list() {
    return Object.values(shelvesStore.all)
  },
  initial() {
    return {
      name: null,
      references: {},
      cellar: null,
    }
  },
  find(id) {
    return fetchShelve(id)
  },
  save(shelve, id) {
    return save(saveShelve, shelve, id)
  },
  on() {
    subscribe(onShelvesRefresh, shelvesStore)
  },
  off() {
    unsubscribe(shelvesStore)
  },
})

export default shelvesStore
