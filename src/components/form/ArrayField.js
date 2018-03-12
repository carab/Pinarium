import React, {Component} from 'react'
import IconButton from 'material-ui/IconButton'
import RemoveCircleOutlineIcon from 'material-ui-icons/RemoveCircleOutline'
import AddCircleOutlineIcon from 'material-ui-icons/AddCircleOutline'

function copyArray(array) {
  return [...array]
}

export default class ArrayField extends Component {
  state = {
    value: Array.isArray(this.props.value) ? this.props.value : [],
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      value: Array.isArray(newProps.value) ? newProps.value : [],
    })
  }

  handleChange = value => {
    const {onChange} = this.props

    if (onChange instanceof Function) {
      onChange(value)
    }
  }

  handleChangeElement = i => elementValue => {
    const value = copyArray(this.state.value)
    value[i] = elementValue
    console.log('handleChangeElement', value)
    this.handleChange(value)
  }

  handleRemoveElement = i => elementValue => {
    const value = copyArray(this.state.value)
    value.splice(i, 1)
    this.handleChange(value)
  }

  handleAddElement = () => {
    const value = copyArray(this.state.value)
    value.push(null)
    this.handleChange(value)
  }

  render() {
    const {element, ...props} = this.props
    const {value} = this.state

    return (
      <div {...props}>
        {value.map((elementValue, i) => (
          <div key={i}>
            <element.type
              {...element.props}
              value={elementValue}
              onChange={this.handleChangeElement(i)}
            />
            <IconButton onClick={this.handleRemoveElement(i)}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </div>
        ))}
        <IconButton onClick={this.handleAddElement}>
          <AddCircleOutlineIcon />
        </IconButton>
      </div>
    )
  }
}
