import React, {Component, Fragment} from 'react'
import {view} from 'react-easy-state'
import {withRouter, Link} from 'react-router-dom'
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListItemIcon,
} from 'material-ui/List'
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table'
import Menu, {MenuItem} from 'material-ui/Menu'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import {withStyles} from 'material-ui/styles'
import withWidth from 'material-ui/utils/withWidth'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import DeleteIcon from 'material-ui-icons/Delete'

import cellars from '../stores/cellars'
import crates from '../stores/crates'
import {deleteCrate} from '../api/crateApi'

@withRouter
@withWidth()
@withStyles(theme => ({
  root: {
    margin: theme.spacing.unit * 2,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '600px',
  },
  row: {
    cursor: 'pointer',
  },
}))
@view
export default class CrateList extends Component {
  render() {
    const {width} = this.props

    if ('xs' === width || 'sm' === width) {
      return this.renderList()
    }

    return this.renderTable()
  }

  renderTable() {
    const {history, classes} = this.props

    return (
      <Paper>
        <Toolbar>
          <Typography variant="subheading">
            {crates.data.length} crates
          </Typography>
        </Toolbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell numeric>Quantity</TableCell>
              <TableCell>Cellar</TableCell>
              <TableCell>Appellation</TableCell>
              <TableCell numeric>Vintage</TableCell>
              <TableCell>Producer</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {crates.data.map(crate => (
              <TableRow
                key={crate.$ref.id}
                hover
                className={classes.row}
                onClick={() =>
                  history.push({
                    pathname: `/crates/edit/${crate.$ref.id}`,
                    state: {modal: true},
                  })
                }
              >
                <TableCell numeric>{crate.quantity}</TableCell>
                <TableCell>
                  <CellarProvider id={crate.cellar.id}>
                    {cellar => cellar && cellar.title}
                  </CellarProvider>
                </TableCell>
                <TableCell>{crate.appellation}</TableCell>
                <TableCell numeric>{crate.vintage}</TableCell>
                <TableCell>{crate.producer}</TableCell>
                <TableCell>
                  <CrateMenu crate={crate} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    )
  }

  renderList() {
    const {classes} = this.props

    return (
      <Paper className={classes.root}>
        <List>
          {crates.data.map(crate => (
            <ListItem key={crate.$ref.id}>
              <ListItemText
                primary={`${crate.appellation} ${crate.vintage} ${
                  crate.producer
                }`}
                secondary={''}
              />
              <ListItemSecondaryAction>
                <CrateMenu crate={crate} />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    )
  }
}

class CrateMenu extends Component {
  state = {
    anchorEl: null,
  }

  handleMenu = event => {
    event.stopPropagation()
    this.setState({anchorEl: event.currentTarget})
  }

  handleClose = event => {
    event.stopPropagation()
    this.setState({anchorEl: null})
  }

  handleDelete = event => {
    const {crate} = this.props
    this.handleClose(event)
    deleteCrate(crate.$ref.id)
  }

  render() {
    const {crate} = this.props
    const {anchorEl} = this.state

    const open = Boolean(anchorEl)
    const id = `user-menu-${crate.$ref.id}`

    return (
      <Fragment>
        <IconButton
          aria-owns={open ? id : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id={id}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleDelete}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </Menu>
      </Fragment>
    )
  }
}

@view
class CellarProvider extends Component {
  render() {
    const {children, id} = this.props
    const cellar = cellars.data.find(cellar => cellar.$ref.id === id)
    return children(cellar) || null
  }
}
