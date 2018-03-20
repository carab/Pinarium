import React from 'react'
import {TableCell} from 'material-ui/Table'
import {withStyles} from 'material-ui/styles'

import TextField from '../form/TextField'

export function predicate(value, filter) {
  if (filter.value) {
    if (filter.value.max && filter.value.min) {
      return value >= filter.value.min && value <= filter.value.max
    }
    if (filter.value.max) {
      return value <= filter.value.max
    }
    if (filter.value.min) {
      return value >= filter.value.min
    }
  }

  return true
}

@withStyles(theme => ({
  cell: {
    width: '100%',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  input: {
    width: '50%',
  },
}))
export class FilterCell extends React.Component {
  render() {
    const {filter, classes} = this.props

    return (
      <TableCell className={classes.cell}>
        <TextField
          className={classes.input}
          type="number"
          name="min"
          value={
            filter && filter.value && filter.value.min ? filter.value.min : ''
          }
          onChange={this.handleFilter}
          placeholder="Min"
          style={{paddingRight: '0.5em'}}
        />
        <TextField
          className={classes.input}
          type="number"
          name="max"
          value={
            filter && filter.value && filter.value.max ? filter.value.max : ''
          }
          onChange={this.handleFilter}
          placeholder="Max"
          style={{paddingLeft: '0.5em'}}
        />
      </TableCell>
    )
  }

  handleFilter = (fieldValue, name) => {
    const {onFilter, filter} = this.props
    const value = filter && filter.value ? filter.value : {}

    value[name] = Number(fieldValue)

    onFilter({
      value,
    })
  }
}
