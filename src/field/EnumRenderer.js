import {useTranslation} from 'react-i18next/hooks'

function EnumRenderer({value, name}) {
  const [t] = useTranslation()

  if (value) {
    return t(`enum.${name}.${value}`)
  }

  return null
}

export default EnumRenderer
