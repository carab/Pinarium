import React from 'react'
import {observer} from 'mobx-react-lite'

import SelectField from './SelectField'

import {useCellars} from '../stores/cellars'

export default observer(function CellarField(props) {
  const cellars = useCellars()
  const options = cellars.slice()

  return (
    <SelectField
      options={options}
      labelAccessor={cellar => cellar.name}
      keyAccessor="id"
      valueAccessor="$ref"
      {...props}
    />
  )
})
