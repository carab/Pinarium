import React, {Component} from 'react'
import {TableCell} from 'material-ui/Table'

export class FilterCell extends Component {
  render() {
    return <TableCell />
  }
}

export class RowCell extends Component {
  render() {
    const {column} = this.props
    return (
      <TableCell padding="checkbox">
        {column.actions ? column.actions(this.props) : null}
      </TableCell>
    )
  }
}
