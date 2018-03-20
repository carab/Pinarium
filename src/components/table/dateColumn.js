import React from 'react'
import formatDate from 'date-fns/format'
import {TableCell} from 'material-ui/Table'
import {withStyles} from 'material-ui/styles'

import DateField from '../form/DateField'


export function Formatter({value}) {
  return formatDate(value, 'L')
}

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
}))
export class FilterCell extends React.Component {
  render() {
    const {filter, classes} = this.props

    return (
      <TableCell className={classes.cell}>
        <DateField
          className={classes.input}
          name="min"
          value={
            filter && filter.value && filter.value.min ? filter.value.min : null
          }
          onChange={this.handleFilter}
          placeholder="Min"
        />
        <DateField
          className={classes.input}
          name="max"
          value={
            filter && filter.value && filter.value.max ? filter.value.max : null
          }
          onChange={this.handleFilter}
          placeholder="Max"
        />
      </TableCell>
    )
  }

  handleFilter = (fieldValue, name) => {
    const {onFilter, filter} = this.props
    const value = filter && filter.value ? filter.value : {}

    value[name] = fieldValue
    console.log(value)
    onFilter({
      value,
    })
  }
}
