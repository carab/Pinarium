import {extendObservable} from 'mobx'

import Log, {autocompletes} from '../models/log'
import {makeStore, useCollection, useDocument} from './utils'
import statusesDef from '../enums/statuses'

const logs = extendObservable(makeStore(Log, 'logs', autocompletes), {
  createFrom(template, user) {
    const log = this.create()

    log.when = template.when ? template.when : new Date()
    log.status = template.status

    // Specific status behavior
    const statusDef = statusesDef.find(
      statusDef => statusDef.name === log.status
    )

    if (user && statusDef && statusDef.fields.indexOf('cellar') > -1) {
      log.cellar = user.defaultCellar
    }

    // Bottles filter
    log.bottles = template.bottles

    return log
  },
})

export default logs

export function useLogs($refs) {
  return useCollection(logs, $refs)
}

export function useLog($ref) {
  return useDocument(logs, $ref)
}
