import React from 'react'
import {observer} from 'mobx-react-lite'

import {useAuth} from '../stores/auth'
import {MainLoader} from '../ui/MainLoader'

export default observer(function AuthProvider({children}) {
  const auth = useAuth()

  if (undefined === auth.user) {
    return <MainLoader />
  }

  return children
})
