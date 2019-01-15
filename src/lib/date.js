import {fr} from 'date-fns/locale'
import formatter from 'date-fns/format'

const locales = {
  fr,
}

export function format(date, format, locale) {
  return formatter(date, format, {locale: getLocaleData(locale)})
}

export function getLocaleData(locale) {
  return locales[locale] || null
}
