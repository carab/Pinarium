import useLocale from '../hooks/useLocale'
import {format} from '../lib/date'

function DateRenderer({value}) {
  const [locale] = useLocale()

  if (value) {
    return format(value, 'P', locale)
  }

  return null
}

export default DateRenderer
