import {store} from 'react-easy-state'

import {subscribe, unsubscribe, save} from './utils'
import {onEtiquettesRefresh, saveEtiquette} from '../api/etiquetteApi'

const etiquettesStore = store({
  all: {},
  get list() {
    return Object.values(etiquettesStore.all)
  },
  find(id) {
    return etiquettesStore.all[id]
  },
  save(etiquette) {
    return save(saveEtiquette, etiquette)
  },
  on() {
    subscribe(onEtiquettesRefresh, etiquettesStore)
  },
  off() {
    unsubscribe(etiquettesStore)
  },
})

export default etiquettesStore
