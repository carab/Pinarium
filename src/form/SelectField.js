import React from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'

export default function SelectField({
  multiple,
  required,
  options,
  onChange,
  keyAccessor,
  labelAccessor,
  valueAccessor,
  value,
  empty,
  SelectProps,
  InputLabelProps,
  ...props
}) {
  const handleChange = event => {
    const {value, name} = event.target

    if (onChange instanceof Function) {
      const option = options.find(option => {
        return value === getKey(getValue(option, valueAccessor), keyAccessor)
      })

      if (option) {
        const computedValue = getValue(option, valueAccessor)
        onChange(computedValue, name)
      }
    }
  }

  return (
    <TextField
      select
      required={required}
      value={getKey(value, keyAccessor) || (multiple ? [] : '')}
      onChange={handleChange}
      SelectProps={{
        multiple,
        ...SelectProps,
      }}
      InputLabelProps={{
        shrink: true,
        ...InputLabelProps,
      }}
      {...props}
    >
      {!required ? (
        <MenuItem value="">
          <em>{empty ? empty : 'None'}</em>
        </MenuItem>
      ) : null}
      {options.map((option, i) => (
        <MenuItem
          key={i}
          value={getKey(getValue(option, valueAccessor), keyAccessor)}
        >
          {getLabel(option, labelAccessor)}
        </MenuItem>
      ))}
    </TextField>
  )
}

SelectField.defaultProps = {
  labelAccessor: 'label',
  keyAccessor: null,
  valueAccessor: 'value',
}

function getLabel(option, labelAccessor) {
  if (labelAccessor instanceof Function) {
    return labelAccessor(option)
  }

  return option[labelAccessor]
}

function getKey(value, keyAccessor) {
  if (undefined === value) {
    return undefined
  }

  if (null === value) {
    return ''
  }

  if (null === keyAccessor) {
    return value
  }

  if (keyAccessor instanceof Function) {
    return keyAccessor(value)
  }

  return value[keyAccessor]
}

function getValue(option, valueAccessor) {
  if (valueAccessor instanceof Function) {
    return valueAccessor(option)
  }

  return option[valueAccessor]
}
