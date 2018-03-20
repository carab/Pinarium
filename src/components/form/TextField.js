import React, {Component} from 'react'
import BaseTextField from 'material-ui/TextField'

export default class TextField extends Component {
  handleChange = event => {
    const {value} = event.target
    const {onChange, name} = this.props

    if (onChange instanceof Function) {
      const realValue = (value.length) ? value : null
      onChange(realValue, name)
    }
  }

  render() {
    const {onChange, value, ...props} = this.props

    return (
      <BaseTextField
        value={value || ''}
        onChange={this.handleChange}
        {...props}
      />
    )
  }
}
