import Cellar from '../models/cellar'
import {makeStore, useCollection, useDocument} from './utils'

const cellarsStore = makeStore(Cellar, 'cellars')
export default cellarsStore

export function useCellars() {
  return useCollection(cellarsStore)
}

export function useCellar($ref) {
  return useDocument(cellarsStore, $ref)
}
