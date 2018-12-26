import {extendObservable, action} from 'mobx'
import itemsjs from 'itemsjs'

import Bottle from '../models/bottle'
import {useCollection, useDocument, makeStore} from './utils'

const configuration = {
  searchableFields: ['appellation', 'vintage', 'producer', 'cellar'],
  aggregations: {
    sort: {
      title: 'Sort',
      size: 10,
    },
    appellation: {
      title: 'Appellation',
      size: 10,
    },
    cellar: {
      title: 'Cellar',
      size: 10,
    },
    cuvee: {
      title: 'Cuvee',
      size: 10,
    },
    vintage: {
      title: 'Vintage',
      size: 10,
    },
    producer: {
      title: 'Producer',
      size: 10,
    },
    effervescence: {
      title: 'Effervescence',
      size: 10,
    },
    procurement: {
      title: 'Procurement',
      size: 10,
    },
    rating: {
      title: 'Rating',
      size: 10,
    },
    color: {
      title: 'Color',
      size: 10,
    },
    type: {
      title: 'Type',
      size: 10,
    },
  },
}

const Index = itemsjs([], configuration)
let reindexes = 0

const bottles = extendObservable(
  makeStore(Bottle, 'bottles'),
  {
    // Selection
    selected: {},
    get selectedBottles() {
      const ids = Object.keys(this.selected)
      return this.all.filter(bottle => ids.indexOf(bottle.$ref.id) !== -1)
    },
    isSelected(bottle) {
      return Boolean(this.selected[bottle.$ref.id])
    },
    select(bottles) {
      bottles.forEach(bottle => {
        this.selected[bottle.$ref.id] = true
      })
    },
    unselect(bottles) {
      bottles.forEach(bottle => {
        delete this.selected[bottle.$ref.id]
      })
    },

    // Search
    autocompleteQuery: '',
    autocompleteItems: [],
    sort: {
      field: 'creationDate',
      order: 'desc',
    },
    get reindexes() {
      Index.reindex(this.all)
      return reindexes++
    },
    get filters() {
      const filters = {}
      this.autocompleteItems.forEach(filter => {
        filters[filter.name] = filter.value
      })

      return filters
    },
    get search() {
      ;(() => this.reindexes)() // Only here to trigger the observer

      return Index.search({
        filters: this.filters,
        sort: this.sort,
        per_page: 20,
      })
    },
    get autocompleteSuggestions() {
      ;(() => this.reindexes)() // Only here to trigger the observer

      if (this.autocompleteQuery.length <= 1) {
        return []
      }

      const suggestions = Object.keys(configuration.aggregations)
        .filter(aggregation => {
          const item = this.autocompleteItems.find(
            item => item.name === aggregation
          )
          return undefined === item
        })
        .reduce((accumulator, aggregation) => {
          const results = Index.aggregation({
            name: aggregation,
            per_page: 10,
            query: this.autocompleteQuery,
          })

          const suggestions = results.data.buckets.map(bucket => {
            return {name: aggregation, value: bucket.key}
          })

          return accumulator.concat(suggestions)
        }, [])

      return suggestions
    },
  },
  {
    select: action,
    unselect: action,
  }
)

export default bottles

export function useBottles() {
  return useCollection(bottles)
}

export function useBottle($ref) {
  return useDocument(bottles, $ref)
}
