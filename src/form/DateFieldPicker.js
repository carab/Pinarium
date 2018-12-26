import React from 'react'
import {DatePicker} from 'material-ui-pickers'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import EventIcon from '@material-ui/icons/Event'

export default function DateField({
  value,
  name,
  onChange,
  InputLabelProps,
  ...props
}) {
  const handleChange = date => {
    if (onChange instanceof Function) {
      onChange(date, name)
    }
  }

  return (
    <DatePicker
      value={value || null}
      name={name}
      onChange={handleChange}
      format="P"
      keyboard
      clearable
      invalidLabel={'Unknown'}
      emptyLabel={''}
      okLabel={'OK'}
      cancelLabel={'Cancel'}
      clearLabel={'Clear'}
      leftArrowIcon={<KeyboardArrowLeftIcon />}
      rightArrowIcon={<KeyboardArrowRightIcon />}
      keyboardIcon={<EventIcon />}
      InputLabelProps={{
        shrink: true,
        ...InputLabelProps,
      }}
      {...props}
    />
  )
}
