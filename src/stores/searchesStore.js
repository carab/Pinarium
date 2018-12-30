import Search from '../models/search'
import {makeStore, useCollection, useDocument} from './utils'

const searches = makeStore(Search, 'searches')
export default searches

export function useSearches() {
  return useCollection(searches)
}

export function useSearch($ref) {
  return useDocument(searches, $ref)
}
