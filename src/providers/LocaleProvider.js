import React, {useState, useEffect, createContext} from 'react'
import {useTranslation} from 'react-i18next/hooks'

export const LocaleContext = createContext({locale: null, setLocale: () => {}})

export default function LocaleProvider({children}) {
  const [, i18n] = useTranslation()
  const [locale, setLocale] = useState(i18n.language.substring(0, 2))

  useEffect(
    () => {
      i18n.changeLanguage(locale)
    },
    [locale]
  )

  return (
    <LocaleContext.Provider value={{locale, setLocale}}>
      {children}
    </LocaleContext.Provider>
  )
}
