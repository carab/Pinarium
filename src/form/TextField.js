import React from 'react'
import BaseTextField from '@material-ui/core/TextField'

export default function TextField({
  onChange,
  value,
  InputLabelProps,
  ...props
}) {
  const handleChange = event => {
    const {value, name} = event.target

    if (onChange instanceof Function) {
      const computedValue = value === '' ? null : value
      onChange(computedValue, name)
    }
  }

  return (
    <BaseTextField
      value={value === null ? '' : value}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
        ...InputLabelProps,
      }}
      {...props}
    />
  )
}
