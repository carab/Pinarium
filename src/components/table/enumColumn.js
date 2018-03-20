import React from 'react'
import {TableCell} from 'material-ui/Table'
import {withStyles} from 'material-ui/styles'

import SelectField from '../form/SelectField'


export function Formatter({value}) {
  return value || null
}

@withStyles(theme => ({
  cell: {
    width: '100%',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  input: {
    width: '100%',
  },
}))
export class FilterCell extends React.Component {
  render() {
    const {filter, classes, column} = this.props

    return (
      <TableCell className={classes.cell}>
        <SelectField
          className={classes.input}
          value={filter && filter.value ? filter.value : ''}
          onChange={this.handleFilter}
          placeholder="Filter..."
          options={column.options}
        />
      </TableCell>
    )
  }

  handleFilter = value => {
    const {onFilter} = this.props

    if (null === value) {
      onFilter(null)
    } else {
      onFilter({
        value,
      })
    }
  }
}
