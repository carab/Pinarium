import User from '../models/user'
import {makeStore, useDocument} from './utils'
import auth from './auth'

const userStore = makeStore(User)
export default userStore

export function useUser($ref) {
  return useDocument(userStore, auth.user ? auth.user.uid : undefined)
}
