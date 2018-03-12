import React, {Component} from 'react'
import {DatePicker} from 'material-ui-pickers'
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight'
import EventIcon from 'material-ui-icons/Event'

export default class DateField extends Component {
  handleChange = date => {
    const {onChange} = this.props

    if (onChange instanceof Function) {
      const realDate = date.toDate()
      onChange(realDate)
    }
  }

  render() {
    const {onChange, value, ...props} = this.props

    return (
      <DatePicker
        value={value || null}
        onChange={this.handleChange}
        format="L"
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
        {...props}
      />
    )
  }
}
