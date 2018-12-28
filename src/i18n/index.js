import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import {initReactI18next} from 'react-i18next/hooks'

async function loadLocales(url, options, callback, data) {
  try {
    const locale = await import('./' + url + '.json')
    callback(locale, {status: '200'})
  } catch (e) {
    callback(null, {status: '404'})
  }
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      fallbackLng: 'en',
      //debug: true,
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      backend: {
        loadPath: '{{lng}}',
        parse: data => data,
        ajax: loadLocales,
      },
    },
    (error, t) => {
      if (error) {
        console.error(error)
      }
    }
  )

export default i18n
