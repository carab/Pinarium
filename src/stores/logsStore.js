import {store} from 'react-easy-state'
import sortBy from 'lodash/sortBy'

import {subscribe, unsubscribe, save} from './utils'
import {onLogsRefresh, saveLog, fetchLog} from '../api/logApi'

const logsStore = store({
  all: {},
  get list() {
    return Object.values(logsStore.all)
  },
  initial() {
    return {
      when: new Date(),
    }
  },
  find(id) {
    return logsStore.all[id]
  },
  fetch(id) {
    return fetchLog(id)
  },
  save(log, id) {
    return save(saveLog, log, id)
  },
  on() {
    subscribe(onLogsRefresh, logsStore)
  },
  off() {
    unsubscribe(logsStore)
  },
  sort(logs, iteratees) {
    return sortBy(logs, iteratees)
  },
})

export default logsStore
