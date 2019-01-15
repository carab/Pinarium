import {useEffect} from 'react'
import {observer} from 'mobx-react-lite'

import {useUser} from '../stores/userStore'
import useLocale from '../hooks/useLocale'

export default observer(function UserProvider({children}) {
  const [user, ready] = useUser()
  const [, setLocale] = useLocale()

  useEffect(
    () => {
      if (user && user.locale) {
        setLocale(user.locale)
      } else {
        // save locale and update user email ?
      }
    },
    [user]
  )

  // Wait for user to be loaded
  if (!ready) {
    return null
  }

  return children
})
