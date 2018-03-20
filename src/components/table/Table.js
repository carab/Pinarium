import React, {Component} from 'react'
import {withStyles} from 'material-ui/styles'
import {
  DataTypeProvider,
  SortingState,
  IntegratedSorting,
  FilteringState,
  IntegratedFiltering,
  GroupingState,
  IntegratedGrouping,
} from '@devexpress/dx-react-grid'
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
  TableGroupRow,
  GroupingPanel,
  Toolbar,
} from '@devexpress/dx-react-grid-material-ui'

import * as enumColumn from './enumColumn'
import * as numberColumn from './numberColumn'
import * as dateColumn from './dateColumn'
import * as actionsColumn from './actionsColumn'

const columnTypes = {
  actions: actionsColumn,
  enum: enumColumn,
  date: dateColumn,
  number: numberColumn,
  default: {
    RowCell: Table.Cell,
    FilterCell: TableFilterRow.Cell,
  },
}

@withStyles(theme => ({
  row: {
    cursor: 'pointer',
  },
}))
export default class BigTable extends Component {
  render() {
    const {
      columns,
      rows,
      sorting,
      filtering,
      grouping,
      onFiltering,
      onSorting,
    } = this.props

    const dataProviders = []
    const integratedFiltering = {
      columnExtensions: [],
    }

    columns.forEach(column => {
      const columnType = columnTypes[column.type] || columnTypes.default

      if (columnType.predicate) {
        integratedFiltering.columnExtensions.push({
          columnName: column.name,
          predicate: columnType.predicate,
        })
      }

      if (columnType.Formatter) {
        dataProviders.push({
          formatterComponent: columnType.Formatter,
          for: [column.name],
        })
      }
    })

    return (
      <Grid rows={rows} columns={columns}>
        {dataProviders.map((dataProvider, i) => (
          <DataTypeProvider key={i} {...dataProvider} />
        ))}
        <FilteringState filters={filtering} onFiltersChange={onFiltering} />
        <IntegratedFiltering
          columnExtensions={integratedFiltering.columnExtensions}
        />
        <SortingState sorting={sorting} onSortingChange={onSorting} />
        <IntegratedSorting />
        {grouping ? <GroupingState grouping={grouping} /> : null}
        {grouping ? <IntegratedGrouping /> : null}
        <Table cellComponent={this.renderRowCell} />
        <TableHeaderRow
          showSortingControls={Boolean(sorting)}
          showGroupingControls={Boolean(grouping)}
        />
        <TableFilterRow cellComponent={this.renderFilterCell} />
        {grouping ? <TableGroupRow /> : null}
        {grouping ? <Toolbar /> : null}
        {grouping ? <GroupingPanel showGroupingControls /> : null}
      </Grid>
    )
  }

  renderRowCell = props => {
    const columnType = columnTypes[props.column.type] || columnTypes.default
    const Cell = columnType.RowCell || columnTypes.default.RowCell

    return <Cell {...props} />
  }

  renderFilterCell = props => {
    const columnType = columnTypes[props.column.type] || columnTypes.default
    const Cell = columnType.FilterCell || columnTypes.default.FilterCell

    return <Cell {...props} />
  }
}
