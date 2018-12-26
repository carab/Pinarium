import {useEffect} from 'react'
import {observable, autorun} from 'mobx'

import {onAuth} from '../api/auth'

const auth = observable({
  user: undefined,
  subscribers: 0,
  subscribe() {
    this.subscribers++
    return () => this.subscribers--
  },
})

let unsubscribe
autorun(function start() {
  // Only listen to firebase for the first subscriber
  if (auth.subscribers !== 1) {
    return
  }

  unsubscribe = onAuth(user => {
    auth.user = user
  })
})

autorun(function stop() {
  // Only stop listening when there is no more subscriber
  if (auth.subscribers > 0) {
    return
  }

  if (unsubscribe) {
    unsubscribe()
  }
})

export default auth

export function useAuth() {
  useEffect(() => {
    const unsubscribe = auth.subscribe()
    return unsubscribe
  }, [])

  return auth
}
