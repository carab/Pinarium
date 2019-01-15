import React from 'react'
import {useTranslation} from 'react-i18next/hooks'
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
  const [t] = useTranslation()
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
      autoOk
      invalidLabel={t('form.date.invalid')}
      emptyLabel={t('form.date.empty')}
      okLabel={t('form.date.ok')}
      cancelLabel={t('form.date.cancel')}
      clearLabel={t('form.date.clear')}
      todayLabel={t('form.date.today')}
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
