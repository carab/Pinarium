import {observable, action} from 'mobx'
import {useObservable} from 'mobx-react-lite'
import itemsjs from 'itemsjs'

import {clean} from './autocompletesStore'
import sorts from '../enums/sorts'
import sizes from '../enums/sizes'
import colors from '../enums/colors'
import effervescences from '../enums/effervescences'
import capsules from '../enums/capsules'

const DEFAULT_COLUMNS = ['appellation', 'vintage', 'cuvee', 'producer']
const DEFAULT_SORTS = ['-inDate']

export const VISIBILITIES = [
  {
    name: 'stocked',
    value: true,
  },
  {
    name: 'unstocked',
    value: false,
  },
  {
    name: 'all',
    value: undefined,
  },
]

export const SORTS = ['-inDate']

export const FIELDS = [
  {name: 'sort', type: 'enum'},
  {name: 'cellar', type: 'cellar'},
  {name: 'appellation', type: 'autocomplete'},
  {name: 'vintage', type: 'autocomplete'},
  // {name: 'bottlingDate', type: 'date'},
  // {name: 'expirationDate', type: 'date'},
  {name: 'cuvee', type: 'autocomplete'},
  {name: 'producer', type: 'autocomplete'},
  {name: 'region', type: 'autocomplete'},
  {name: 'country', type: 'autocomplete'},
  {name: 'size', type: 'enum'},
  {name: 'color', type: 'enum'},
  {name: 'effervescence', type: 'enum'},
  {name: 'type', type: 'enum'},
  {name: 'capsule', type: 'enum'},
  {name: 'alcohol', type: 'autocomplete'},
  {name: 'medal', type: 'autocomplete'},
]

export const ENUMS = {
  sort: sorts.map(sort => sort.name),
  size: sizes,
  color: colors,
  effervescence: effervescences,
  type: [].concat(...sorts.map(sort => sort.types)),
  capsule: capsules,
}

const configuration = {
  searchableFields: [
    'sort',
    'appellation',
    'vintage',
    'producer',
    'region',
    'country',
    'cellar',
  ],
  aggregations: {
    sort: {
      title: 'Sort',
      size: 10,
    },
    appellation: {
      title: 'Appellation',
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

const searchStore = observable(
  {
    source: [],
    input: '',
    visibility: true,
    filters: [],
    columns: DEFAULT_COLUMNS,
    sorts: DEFAULT_SORTS,
    statuses: DEFAULT_SORTS,
    perPage: 10,
    page: 0,
    cellars: [],
    enums: [],
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
      return sorts.join(',')
    },
    unserializeSorts(sorts) {
      if (!sorts) {
        return null
      }

      return sorts.split(',')
    },
    isSortActive(name) {
      const index = this.sorts.findIndex(sort => sort.substring(1) === name)
      return index >= 0
    },
    isSortAsc(name) {
      const index = this.sorts.findIndex(sort => sort === `+${name}`)
      return index >= 0
    },
    toggleSort(name) {
      const sort = this.sorts.pop()

      if (sort.substring(1) === name) {
        if (sort.substring(0, 1) === '+') {
          this.sorts.push(`-${name}`)
        } else {
          this.sorts.push(`+${name}`)
        }
      } else {
        this.sorts.push(`+${name}`)
      }
    },
    matchers: {
      enum: () => [],
      cellar: () => [],
      autocomplete: () => [],
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
      const sorts = this.sorts.map(sort => [
        sort.substring(1),
        sort.substring(0, 1),
      ])

      const sort = {
        field: sorts.map(([field]) => field),
        order: sorts.map(([, order]) => (order === '+' ? 'asc' : 'desc')),
      }

      return sort
    },
    get itemjsPerPage() {
      return this.source.length
      // return this.perPage
    },
    get itemjsPage() {
      return 1
      // return this.page + 1
    },
    get reindexes() {
      console.log('reindex')
      Index.reindex(this.source)
      return reindexes++
    },
    get search() {
      ;(() => this.reindexes)() // Only here to trigger the reindex

      return Index.search({
        filters: this.itemjsFilters,
        sort: this.itemjsSort,
        per_page: this.itemjsPerPage,
        page: this.itemjsPage,
        filter: item => {
          const keep = this.filters.reduce((keep, [name, value]) => {
            if (name === 'cellar') {
              return item.cellar && item.cellar.id === value
            }

            return keep
          }, true)

          return keep
        },
      })
    },
    do(page) {
      ;(() => this.reindexes)() // Only here to trigger the reindex

      return Index.search({
        filters: this.itemjsFilters,
        sort: this.itemjsSort,
        per_page: this.itemjsPerPage,
        page: page,
        filter: item => {
          const keep = this.filters.reduce((keep, [name, value]) => {
            if (name === 'cellar') {
              return item.cellar && item.cellar.id === value
            }

            return keep
          }, true)

          return keep
        },
      })
    },
    get suggestions() {
      //;(() => this.reindexes)() // Only here to trigger the reindex

      if (this.input.length <= 1) {
        return []
      }

      const query = clean(this.input)
      const match = value => {
        const cleanedValue = clean(value)
        return cleanedValue && cleanedValue.indexOf(query) !== -1
      }

      const suggestions = FIELDS.filter(field => {
        const item = this.filters.find(([name]) => name === field.name)
        return undefined === item
      }).reduce((accumulator, field) => {
        const matcher = this.matchers[field.type]
        const suggestions = matcher(field, match)
        accumulator.push(...suggestions)
        return accumulator
      }, [])
      // const suggestions = Object.keys(configuration.aggregations)
      //   .filter(aggregation => {
      //     const item = this.filters.find(([name]) => name === aggregation)
      //     return undefined === item
      //   })
      //   .reduce((accumulator, aggregation) => {
      //     const results = Index.aggregation({
      //       name: aggregation,
      //       per_page: 10,
      //       query: this.input,
      //     })

      //     const suggestions = results.data.buckets.map(bucket => {
      //       return {name: aggregation, value: bucket.key}
      //     })

      //     return accumulator.concat(suggestions)
      //   }, [])

      return suggestions
    },
    setPage(page) {
      this.page = page
    },
  },
  {
    toggleColumn: action,
    toggleSort: action,
  }
)

export default searchStore

export function useSearch() {
  // const [cellars] = useCellars()
  // const [t] = useTranslation()
  const Search = useObservable(searchStore)

  return Search
}
