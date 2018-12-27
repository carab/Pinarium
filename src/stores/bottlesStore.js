import {store} from 'react-easy-state'

import {subscribe, unsubscribe, save} from './utils'
import {
  updateBottles,
  onBottlesRefresh,
  saveBottle,
  fetchBottle,
} from '../api/bottleApi'

const bottlesStore = store({
  all: {},
  get list() {
    return Object.values(bottlesStore.all)
  },
  initial() {
    return {
      etiquette: null,
      cellar: null,
      shelve: null,
      inLog: null,
      outLog: null,
      logs: {},
      picked: false,
      drank: false,
    }
  },
  find(id) {
    return bottlesStore.all[id]
  },
  fetch(id) {
    return fetchBottle(id)
  },
  save(bottle, id) {
    return save(saveBottle, bottle, id)
  },
  update(bottles, data) {
    updateBottles(bottles.map(bottle => bottle.$ref), data)
  },
  on() {
    subscribe(onBottlesRefresh, bottlesStore)
  },
  off() {
    unsubscribe(bottlesStore)
  },
})

export default bottlesStore
