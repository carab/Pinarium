import React, {Component} from 'react'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/Menu/MenuItem'

export default class SelectField extends Component {
  static defaultProps = {
    labelAccessor: 'label',
    keyAccessor: null,
    valueAccessor: 'value',
  }

  state = {
    key: this.getKey(this.props.value),
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      key: this.getKey(newProps.value),
    })
  }

  handleChange = event => {
    const {onChange, options, value, name} = this.props
    const {value: key} = event.target

    if (undefined === value) {
      this.setState({
        key,
      })
    }

    if (onChange instanceof Function) {
      let newValue = null

      for (const i in options) {
        const tempValue = this.getValue(options[i])
        if (key === this.getKey(tempValue)) {
          newValue = tempValue
          break
        }
      }

      onChange(newValue, name)
    }
  }

  render() {
    const {
      multiple,
      required,
      options,
      onChange,
      keyAccessor,
      labelAccessor,
      valueAccessor,
      value,
      emptyLabel,
      SelectProps,
      ...props
    } = this.props
    const {key} = this.state

    const selectProps = {
      multiple,
      ...SelectProps,
    }

    const defaultValue = multiple ? [] : ''

    return (
      <TextField
        select
        required
        value={key || defaultValue}
        onChange={this.handleChange}
        SelectProps={selectProps}
        {...props}
      >
        {!required ? <MenuItem value=""><em>{emptyLabel ? emptyLabel : 'None'}</em></MenuItem> : null}
        {options.map((option, i) => (
          <MenuItem key={i} value={this.getKey(this.getValue(option))}>
            {this.getLabel(option)}
          </MenuItem>
        ))}
      </TextField>
    )
  }

  getLabel(option) {
    const {labelAccessor} = this.props

    if (labelAccessor instanceof Function) {
      return labelAccessor(option)
    }

    return option[labelAccessor]
  }

  getKey(value) {
    if (undefined === value) {
      return undefined
    }

    if (!value) {
      return ''
    }

    const {keyAccessor} = this.props

    if (null === keyAccessor) {
      return value
    }

    if (keyAccessor instanceof Function) {
      return keyAccessor(value)
    }

    return value[keyAccessor]
  }

  getValue(option) {
    const {valueAccessor} = this.props

    if (valueAccessor instanceof Function) {
      return valueAccessor(option)
    }

    return option[valueAccessor]
  }
}