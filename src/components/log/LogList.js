import React, {Component, Fragment} from 'react'
import formatDate from 'date-fns/format'
import {view, store} from 'react-easy-state'
import {withRouter} from 'react-router-dom'
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List'
import Hidden from 'material-ui/Hidden'
import {withStyles} from 'material-ui/styles'
import {
  DataTypeProvider,
  SortingState,
  IntegratedSorting,
  FilteringState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid'
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
} from '@devexpress/dx-react-grid-material-ui'

import FilterCell from '../table/FilterCell'
import Container from '../ui/Container'

import logsStore from '../../stores/logsStore'

const DateFormatter = ({value}) => formatDate(value, 'L')

@withRouter
@withStyles(theme => ({
  row: {
    cursor: 'pointer',
  },
}))
@view
export default class LogList extends Component {
  store = store({
    table: {
      columns: [
        {name: 'direction', title: 'Direction'},
        {name: 'when', title: 'When'},
        {name: 'how', title: 'How'},
        {name: 'where', title: 'Where'},
        {name: 'who', title: 'Who'},
        {name: 'value', title: 'Value'},
        {name: 'rate', title: 'Rate', type: 'number'},
      ],
      dateColumns: ['when'],
      sorting: [{columnName: 'when', direction: 'desc'}],
      filters: [],
    },
  })

  componentDidMount() {
    logsStore.on()
  }

  componentWillUnmount() {
    logsStore.off()
  }

  render() {
    return (
      <Fragment>
        <Hidden mdUp>{this.renderSmall()}</Hidden>
        <Hidden smDown>{this.renderLarge()}</Hidden>
      </Fragment>
    )
  }

  renderLarge() {
    const {table} = this.store

    return (
      <Container full title="Logs">
        <Grid rows={logsStore.list} columns={table.columns}>
          <DataTypeProvider
            formatterComponent={DateFormatter}
            for={table.dateColumns}
          />
          <FilteringState
            filters={table.filters}
            onFiltersChange={this.handleFiltering}
          />
          <IntegratedFiltering />
          <SortingState
            sorting={table.sorting}
            onSortingChange={this.handleSorting}
          />
          <IntegratedSorting />
          <Table />
          <TableHeaderRow showSortingControls />
          <TableFilterRow cellComponent={FilterCell} />
        </Grid>
      </Container>
    )
  }

  renderSmall() {
    return (
      <Container title="Logs">
        <List>{logsStore.list.map(this.renderLogItem)}</List>
      </Container>
    )
  }

  renderLogItem = log => {
    return (
      <ListItem key={log.$doc.id} onClick={this.handleClick(log)}>
        <ListItemText
          primary={`${log.appellation} ${log.vintage} ${log.producer}`}
          secondary={''}
        />
        <ListItemSecondaryAction />
      </ListItem>
    )
  }

  handleFiltering = filters => {
    this.store.table.filters = filters
  }

  handleSorting = sorting => {
    this.store.table.sorting = sorting
  }

  handleClick = log => () => {
    const {history} = this.props

    history.push({
      pathname: `/logs/${log.$doc.id}`,
      state: {modal: true},
    })
  }
}
