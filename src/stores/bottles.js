import {extendObservable, action} from 'mobx'

import Bottle, {autocompletes} from '../models/bottle'
import {useCollection, useDocument, makeStore} from './utils'

const bottles = extendObservable(
  makeStore(Bottle, 'bottles', autocompletes),
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
