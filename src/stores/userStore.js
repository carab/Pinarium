import {extendObservable} from 'mobx'

import User from '../models/user'
import {makeStore, useDocument} from './utils'
import auth from './auth'

const userStore = extendObservable(makeStore(User), {
  document: null,
}, {

})
export default userStore

export function useUser() {
  return useDocument(userStore, auth.user ? auth.user.uid : undefined, userStore)
}
