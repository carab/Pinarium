import Cellar from '../models/cellar'
import {makeStore, useCollection, useDocument} from './utils'

const cellars = makeStore(Cellar, 'cellars')
export default cellars

export function useCellars() {
  return useCollection(cellars)
}

export function useCellar($ref) {
  return useDocument(cellars, $ref)
}
