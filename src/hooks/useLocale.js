import {LocaleContext} from '../providers/LocaleProvider'
import {useContext} from 'react'

export default function useLocale() {
  const {locale, setLocale} = useContext(LocaleContext)
  return [locale, setLocale]
}
