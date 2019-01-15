import {observer} from 'mobx-react-lite'

import {useCellar} from '../stores/cellarsStore'

function CellarRenderer({value}) {
  const [cellar, ready] = useCellar(value)

  if (ready) {
    return cellar ? cellar.name : null
  }

  return null
}

export default observer(CellarRenderer)
