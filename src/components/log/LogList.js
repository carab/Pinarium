import React, {Component, Fragment} from 'react'
import {view, store} from 'react-easy-state'
import {withRouter} from 'react-router-dom'
import {Link} from 'react-router-dom'
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List'
import Hidden from 'material-ui/Hidden'
import {withStyles} from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'

import Container from '../ui/Container'
import {EditIcon} from '../ui/Icons'
import Table from '../table/Table'

import directions from '../../enums/directions'
import procurements from '../../enums/procurements'
import ratings from '../../enums/ratings'

import logsStore from '../../stores/logsStore'

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
        {
          name: 'direction',
          title: 'Direction',
          type: 'enum',
          options: directions.map(direction => ({
            value: direction,
            label: direction,
          })),
        },
        {name: 'when', title: 'When', type: 'date'},
        {
          name: 'how',
          title: 'How',
          type: 'enum',
          options: procurements.map(procurement => ({
            value: procurement,
            label: procurement,
          })),
        },
        {name: 'where', title: 'Where'},
        {name: 'who', title: 'Who'},
        {name: 'value', title: 'Value'},
        {name: 'rate', title: 'Rate', type: 'number'},
        {
          name: '',
          title: '',
          actions: ({row}) => (
            <IconButton
              aria-label="Edit a log"
              component={Link}
              to={{
                pathname: `/logs/${row.$doc.id}`,
                state: {modal: true},
              }}
            >
              <EditIcon />
            </IconButton>
          ),
        },
      ],
      sorting: [{columnName: 'when', direction: 'desc'}],
      filtering: [],
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
        <Table
          rows={logsStore.list}
          columns={table.columns}
          filtering={table.filtering}
          sorting={table.sorting}
          onFiltering={this.handleFiltering}
          onSorting={this.handleSorting}
        />
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

  handleFiltering = filtering => {
    this.store.table.filtering = filtering
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
