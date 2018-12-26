import {observer} from 'mobx-react-lite'

import {useAuth} from '../stores/auth'

export default observer(function AuthProvider({children}) {
  const auth = useAuth()

  if (undefined === auth.user) {
    return 'loading'
  }

  return children
})
