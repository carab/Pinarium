import {observable} from 'mobx'
import {useObservable} from 'mobx-react-lite'
import itemsjs from 'itemsjs'

import bottlesStore from './bottles'

const DEFAULT_COLUMNS = ['appellation', 'vintage', 'cuvee', 'producer']
const DEFAULT_SORTS = [['creationDate', '-']]

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

const searchStore = observable({
  input: '',
  filters: [],
  columns: DEFAULT_COLUMNS,
  sorts: DEFAULT_SORTS,
  get query() {
    const query = [...this.filters]

    if (
      this.columns.length &&
      this.serializeColumns(this.columns) !==
        this.serializeColumns(DEFAULT_COLUMNS)
    ) {
      query.push(['columns', this.serializeColumns(this.columns)])
    }

    if (
      this.sorts.length &&
      this.serializeSorts(this.sorts) !== this.serializeSorts(DEFAULT_SORTS)
    ) {
      query.push(['sorts', this.serializeSorts(this.sorts)])
    }

    return query.map(param => param.join('=')).join('&')
  },
  set query(query) {
    const params = query.split('&').map(part => part.split('='))

    this.filters = params.filter(
      ([name]) => name !== 'columns' && name !== 'sorts'
    )

    const columns = params
      .filter(([name]) => name === 'columns')
      .map(([, columns]) => columns)
      .pop()
    this.columns = this.unserializeColumns(columns) || DEFAULT_COLUMNS

    const sorts = params
      .filter(([name]) => name === 'sorts')
      .map(([, sorts]) => sorts)
      .pop()
    this.sorts = this.unserializeSorts(sorts) || DEFAULT_SORTS
  },
  serializeColumns(columns) {
    return columns.join(',')
  },
  unserializeColumns(columns) {
    if (!columns) {
      return null
    }

    return columns.split(',')
  },
  isColumn(name) {
    const index = this.columns.findIndex(column => column === name)
    return index >= 0
  },
  toggleColumn(name) {
    const index = this.columns.findIndex(column => column === name)

    if (index >= 0) {
      this.columns.splice(index, 1)
    } else {
      this.columns.push(name)
    }
  },
  serializeSorts(sorts) {
    return sorts.map(([field, order]) => order + field).join(',')
  },
  unserializeSorts(sorts) {
    if (!sorts) {
      return null
    }

    return sorts
      .split(',')
      .map(sort => [sort.substring(1), sort.substring(0, 1)])
  },

  // ItemJS related
  get itemjsFilters() {
    const filters = {}
    this.filters.forEach(([name, value]) => {
      filters[name] = value
    })

    return filters
  },
  get itemjsSort() {
    const sort = {
      field: this.sorts.map(([field]) => field),
      order: this.sorts.map(([, order]) => (order === '+' ? 'asc' : 'desc')),
    }

    return sort
  },
  get reindexes() {
    Index.reindex(bottlesStore.all)
    return reindexes++
  },
  get search() {
    ;(() => this.reindexes)() // Only here to trigger the reindex

    return Index.search({
      filters: this.itemjsFilters,
      sort: this.itemjsSort,
      per_page: 20,
    })
  },
  get suggestions() {
    ;(() => this.reindexes)() // Only here to trigger the reindex

    if (this.input.length <= 1) {
      return []
    }

    const suggestions = Object.keys(configuration.aggregations)
      .filter(aggregation => {
        const item = this.filters.find(([name]) => name === aggregation)
        return undefined === item
      })
      .reduce((accumulator, aggregation) => {
        const results = Index.aggregation({
          name: aggregation,
          per_page: 10,
          query: this.input,
        })

        const suggestions = results.data.buckets.map(bucket => {
          return {name: aggregation, value: bucket.key}
        })

        return accumulator.concat(suggestions)
      }, [])

    return suggestions
  },
})

export default searchStore

export function useSearch() {
  return useObservable(searchStore)
}
