import {useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next/hooks'

import {useUser} from '../stores/userStore'

export default observer(function UserProvider({children}) {
  const [user, ready] = useUser()
  const [, i18n] = useTranslation()

  useEffect(
    () => {
      if (user && user.locale) {
        i18n.changeLanguage(user.locale)
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
