import React from 'react'
import Input from 'material-ui/Input'
import {TableCell} from 'material-ui/Table'
import {withStyles} from 'material-ui/styles'
import {TableFilterRow} from '@devexpress/dx-react-grid-material-ui'

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
class RangeFilterCell extends React.Component {
  render() {
    const {filter, classes} = this.props

    return (
      <TableCell className={classes.cell}>
        <Input
          className={classes.input}
          type="number"
          name="min"
          value={filter?.value?.min || ''}
          onChange={this.handleFilter}
          placeholder="Min"
        />
        <Input
          className={classes.input}
          type="number"
          name="max"
          value={filter && filter.value ? filter.value.max : ''}
          onChange={this.handleFilter}
          placeholder="Max"
        />
      </TableCell>
    )
  }

  handleFilter = event => {
    const {onFilter, filter} = this.props
    const value = filter?.value || {}
    const name = event.target.name
    const fieldValue = event.target.value ? event.target.value : null

    value[name] = fieldValue
    
    onFilter({
      value,
    })
  }
}

export default function FilterCell(props) {
  if (props.column.type === 'number') {
    return <RangeFilterCell {...props} />
  }

  return <TableFilterRow.Cell {...props} />
}

export function numberRangePredicate(value, filter) {
  if (filter.value) {
    if (filter.value.max && filter.value.min) {
      return value >= filter.value.min && value <= filter.value.max
    }
    if (filter.value.max) {
      return value <= filter.value.max
    }
    if (filter.value.min) {
      return value >= filter.value.max
    }
  }

  return true
}
