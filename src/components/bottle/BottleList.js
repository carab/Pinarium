import React, {Component, Fragment} from 'react'
import {store, view} from 'react-easy-state'
import {withRouter, Link} from 'react-router-dom'
import classnames from 'classnames'
import {withStyles} from 'material-ui/styles'
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table'
import IconButton from 'material-ui/IconButton'
import Hidden from 'material-ui/Hidden'

import {
  PickIcon,
  UnpickIcon,
  DrinkIcon,
  UndrinkIcon,
  EditIcon,
} from '../ui/Icons'
import Container from '../ui/Container'
import BigTable from '../table/Table'

import bottlesStore from '../../stores/bottlesStore'
import etiquettesStore from '../../stores/etiquettesStore'
import cellarsStore from '../../stores/cellarsStore'
import shelvesStore from '../../stores/shelvesStore'
import logsStore from '../../stores/logsStore'

@withRouter
@withStyles(theme => ({
  row: {},
  rowMultiple: {
    cursor: 'pointer',
  },
  rowDisabled: {
    opacity: 0.4,
  },
  rowHighlighted: {
    fontWeight: 'bold',
  },
  cellActions: {
    whiteSpace: 'nowrap',
  },
}))
@view
export default class BottleList extends Component {
  store = store({
    table: {
      columns: [
        {
          name: 'etiquette',
          title: 'Etiquette',
          getCellValue: row => (row.etiquette ? row.etiquette.id : undefined),
        },
        {
          name: 'cellar',
          title: 'Cellar',
          getCellValue: row => (row.cellar ? row.cellar.id : undefined),
        },
        {
          name: 'size',
          title: 'Size',
          getCellValue: row => (row.etiquette ? row.etiquette.size : undefined),
        },
        {
          name: 'vintage',
          title: 'Vintage',
          getCellValue: row =>
            row.etiquette ? row.etiquette.vintage : undefined,
        },
        {
          name: 'appellation',
          title: 'Appellation',
          getCellValue: row =>
            row.etiquette ? row.etiquette.appellation : undefined,
        },
        {
          name: 'cuvee',
          title: 'Cuvée',
          getCellValue: row =>
            row.etiquette ? row.etiquette.cuvee : undefined,
        },
        {
          name: 'producer',
          title: 'Producer',
          getCellValue: row =>
            row.etiquette ? row.etiquette.producer : undefined,
        },
        {name: 'date', title: 'Date added'},
      ],
      sorting: [{columnName: 'date', direction: 'desc'}],
      grouping: [{columnName: 'etiquette'}],
      filtering: [],
    },
  })

  render() {
    const groups = this.compute()

    return (
      <Fragment>
        <Hidden mdUp>{this.renderSmall(groups)}</Hidden>
        <Hidden smDown>{this.renderLarge(groups)}</Hidden>
      </Fragment>
    )
  }

  buildRows() {
    const rows = []

    bottlesStore.list.forEach(bottle => {
      const etiquette = etiquettesStore.find(bottle.etiquette.id)

      if (!etiquette) {
        return
      }

      const row = {
        bottle: bottle,
        etiquette: etiquette,
      }

      rows.push(row)
    })

    return rows
  }

  handleFiltering = filtering => {
    this.store.table.filtering = filtering
  }

  handleSorting = sorting => {
    this.store.table.sorting = sorting
  }

  renderLarge({drank, picked, stocked}) {
    return (
      <Fragment>
        {this.renderTable(picked)}
        {this.renderTable(stocked)}
        {this.renderTable(drank)}
      </Fragment>
    )
  }

  renderSmall({drank, picked, stocked}) {
    return (
      <Fragment>
        {this.renderList(picked)}
        {this.renderList(stocked)}
        {this.renderList(drank)}
      </Fragment>
    )
  }

  renderList(group) {
    return (
      <Container title={group.quantity + ' ' + group.title}>
        <List>
          {Object.values(group.rows).map(row => (
            <ListItem key={row.key}>
              <ListItemText
                primary={`${row.etiquette.appellation} ${row.etiquette.cuvee} ${
                  row.etiquette.producer
                }`}
                secondary={''}
              />
              <ListItemSecondaryAction />
            </ListItem>
          ))}
        </List>
      </Container>
    )
  }

  renderTable(group) {
    const {table} = this.store

    return (
      <Container full title={group.rows.length + ' ' + group.title}>
        <BigTable
          rows={group.rows}
          columns={table.columns}
          filtering={table.filtering}
          grouping={table.grouping}
          sorting={table.sorting}
          onFiltering={this.handleFiltering}
          onSorting={this.handleSorting}
        />
      </Container>
    )
  }

  compute() {
    const picked = {
      title: 'picked',
      rows: [],
    }
    const stocked = {
      title: 'stocked',
      rows: [],
    }
    const drank = {
      title: 'drank',
      rows: [],
    }

    bottlesStore.list.forEach(bottle => {
      const group = bottle.drank ? drank : bottle.picked ? picked : stocked
      group.rows.push(bottle)
    })

    return {picked, stocked, drank}
  }

  renderRow = row => {
    const {classes} = this.props
    const {expanded} = this.store
    const isMultiple = row.bottles.length > 1
    const className = classnames(classes.row, {
      [classes.rowMultiple]: isMultiple,
      [classes.rowDisabled]: row.drank,
      [classes.rowHighlighted]: row.picked,
    })

    return (
      <Fragment key={row.key}>
        <TableRow
          hover={isMultiple}
          className={className}
          onClick={this.handleExpand(row)}
        >
          <TableCell padding="checkbox" className={classes.cellActions}>
            {row.drank ? null : (
              <IconButton
                aria-owns={false ? 'bottles-pick' : null}
                aria-haspopup="true"
                aria-label="Pick/Unpick bottle"
                onClick={this.handlePick(row.bottles, !row.picked)}
              >
                {row.picked ? <UnpickIcon /> : <PickIcon />}
              </IconButton>
            )}
            <IconButton
              aria-owns={false ? 'bottles-drink' : null}
              aria-haspopup="true"
              aria-label="Drink/Undrink bottle"
              onClick={this.handleDrink(row.bottles, !row.drank)}
            >
              {row.drank ? <UndrinkIcon /> : <DrinkIcon />}
            </IconButton>
          </TableCell>
          <TableCell numeric>{row.bottles.length}</TableCell>
          <TableCell numeric>{row.etiquette.size}</TableCell>
          <TableCell numeric>{row.etiquette.vintage}</TableCell>
          <TableCell>{row.etiquette.appellation}</TableCell>
          <TableCell>{row.etiquette.cuvee}</TableCell>
          <TableCell>{row.etiquette.producer}</TableCell>
          <TableCell>
            {!isMultiple ? (
              <IconButton
                aria-owns={false ? 'bottle-pick' : null}
                aria-haspopup="true"
                aria-label="Edit bottle"
                onClick={this.handleStopPropagation}
                component={Link}
                to={{
                  pathname: `/bottles/${row.bottle.$ref.id}`,
                  state: {modal: true},
                }}
              >
                <EditIcon />
              </IconButton>
            ) : null}
          </TableCell>
        </TableRow>
        {isMultiple && row.key === expanded ? (
          <TableRow key={row.key} className={classes.row}>
            <TableCell colSpan={8} padding="dense">
              <List dense>
                {row.bottles.map(bottle => (
                  <ListItem key={bottle.$ref.id}>
                    {row.drank ? null : (
                      <IconButton
                        aria-owns={false ? 'bottle-pick' : null}
                        aria-haspopup="true"
                        aria-label="Pick/Unpick bottle"
                        onClick={this.handlePick([bottle], !bottle.picked)}
                      >
                        {bottle.picked ? <UnpickIcon /> : <PickIcon />}
                      </IconButton>
                    )}
                    <IconButton
                      aria-owns={false ? 'bottle-drink' : null}
                      aria-haspopup="true"
                      aria-label="Drink/Undrink bottle"
                      onClick={this.handleDrink([bottle], !bottle.drank)}
                    >
                      {bottle.drank ? <UndrinkIcon /> : <DrinkIcon />}
                    </IconButton>
                    <ListItemText primary={bottle.$ref.id} />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-owns={false ? 'bottle-pick' : null}
                        aria-haspopup="true"
                        aria-label="Edit bottle"
                        onClick={this.handleStopPropagation}
                        component={Link}
                        to={{
                          pathname: `/bottles/${bottle.$ref.id}`,
                          state: {modal: true},
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </TableCell>
          </TableRow>
        ) : null}
      </Fragment>
    )
  }

  handleStopPropagation = event => {
    event.stopPropagation()
  }

  handleExpand = row => () => {
    if (row.key === this.store.expanded) {
      this.store.expanded = null
    } else {
      this.store.expanded = row.key
    }
  }

  handlePick = (bottles, picked) => event => {
    event.stopPropagation()

    bottlesStore.update(bottles, {
      picked,
    })
  }

  handleDrink = (bottles, drank) => event => {
    event.stopPropagation()

    bottlesStore.update(bottles, {
      drank,
    })
  }
}

function extract(columns, bottle) {
  const values = columns.reduce((a, e) => ((a[e] = bottle[e]), a), {})
  return values
}
