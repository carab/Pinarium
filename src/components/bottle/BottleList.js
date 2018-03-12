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
    expanded: null,
  })

  render() {
    const groups = this.compute(bottlesStore.list)

    return (
      <Fragment>
        <Hidden mdUp>{this.renderSmall(groups)}</Hidden>
        <Hidden smDown>{this.renderLarge(groups)}</Hidden>
      </Fragment>
    )
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
    return (
      <Container full title={group.quantity + ' ' + group.title}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell numeric>Quantity</TableCell>
              <TableCell numeric>Size</TableCell>
              <TableCell numeric>Vintage</TableCell>
              <TableCell>Appellation</TableCell>
              <TableCell>Cuvée</TableCell>
              <TableCell>Producer</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>{Object.values(group.rows).map(this.renderRow)}</TableBody>
        </Table>
      </Container>
    )
  }

  compute(bottles) {
    const picked = {
      title: 'picked',
      quantity: 0,
      rows: {},
    }
    const stocked = {
      title: 'stocked',
      quantity: 0,
      rows: {},
    }
    const drank = {
      title: 'drank',
      quantity: 0,
      rows: {},
    }

    bottles.forEach(bottle => {
      const group = bottle.drank ? drank : bottle.picked ? picked : stocked
      const key = [bottle.etiquette.id, bottle.picked, bottle.drank].join('|')
      const etiquette = etiquettesStore.find(bottle.etiquette.id)

      if (!etiquette) {
        return
      }

      if (!group.rows[key]) {
        group.rows[key] = {
          key,
          etiquette,
          picked: bottle.picked,
          drank: bottle.drank,
          bottle: bottle,
          bottles: [],
        }
      }

      group.rows[key].bottles.push(bottle)
      group.quantity++
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
                  pathname: `/bottles/${row.bottle.$doc.id}`,
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
                  <ListItem key={bottle.$doc.id}>
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
                    <ListItemText primary={bottle.$doc.id} />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-owns={false ? 'bottle-pick' : null}
                        aria-haspopup="true"
                        aria-label="Edit bottle"
                        onClick={this.handleStopPropagation}
                        component={Link}
                        to={{
                          pathname: `/bottles/${bottle.$doc.id}`,
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
