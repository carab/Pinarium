import React, {Component, Fragment} from 'react'
import {view} from 'react-easy-state'
import {withRouter} from 'react-router-dom'
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
import Hidden from 'material-ui/Hidden'
import {withStyles} from 'material-ui/styles'

import Container from '../ui/Container'

import etiquettesStore from '../../stores/etiquettesStore'

@withRouter
@withStyles(theme => ({
  row: {
    cursor: 'pointer',
  },
}))
@view
export default class CrateList extends Component {
  render() {
    return (
      <Fragment>
        <Hidden mdUp>{this.renderSmall()}</Hidden>
        <Hidden smDown>{this.renderLarge()}</Hidden>
      </Fragment>
    )
  }

  renderLarge() {
    return (
      <Container full title="Etiquettes">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sort</TableCell>
              <TableCell>Appellation</TableCell>
              <TableCell>Cuvée</TableCell>
              <TableCell>Producer</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {etiquettesStore.list.map(this.renderEtiquetteRow)}
          </TableBody>
        </Table>
      </Container>
    )
  }

  renderEtiquetteRow = etiquette => {
    const {classes} = this.props

    return (
      <TableRow
        key={etiquette.$doc.id}
        hover
        className={classes.row}
        onClick={this.handleClick(etiquette)}
      >
        <TableCell>{etiquette.sort}</TableCell>
        <TableCell>{etiquette.appellation}</TableCell>
        <TableCell>{etiquette.cuvee}</TableCell>
        <TableCell>{etiquette.producer}</TableCell>
        <TableCell />
      </TableRow>
    )
  }

  renderSmall() {
    return (
      <Container title="Etiquettes">
        <List>{etiquettesStore.list.map(this.renderEtiquetteItem)}</List>
      </Container>
    )
  }

  renderEtiquetteItem = etiquette => {
    return (
      <ListItem key={etiquette.$doc.id} onClick={this.handleClick(etiquette)}>
        <ListItemText
          primary={`${etiquette.appellation} ${etiquette.vintage} ${
            etiquette.producer
          }`}
          secondary={''}
        />
        <ListItemSecondaryAction />
      </ListItem>
    )
  }

  handleClick = etiquette => () => {
    const {history} = this.props

    history.push({
      pathname: `/etiquettes/${etiquette.$doc.id}`,
      state: {modal: true},
    })
  }
}
