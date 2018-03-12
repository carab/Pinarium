import React, {Component, Fragment} from 'react'
import {withRouter, Route, Link} from 'react-router-dom'
import {store, view} from 'react-easy-state'
import {withStyles} from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import List, {ListItem, ListItemText, ListItemIcon} from 'material-ui/List'
import {MenuList, MenuItem} from 'material-ui/Menu'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import Hidden from 'material-ui/Hidden'

import {
  LogoIcon,
  BugIcon,
  EtiquetteIcon,
  BottleIcon,
  CellarIcon,
  ShelfIcon,
  LogIcon,
} from '../ui/Icons'

import user from '../../stores/user'
import uiStore from '../../stores/uiStore'

const routes = [
  {
    pathname: '/bottles',
    label: 'Bottles',
    icon: <BottleIcon />,
  },
  {
    pathname: '/etiquettes',
    label: 'Etiquettes',
    icon: <EtiquetteIcon />,
  },
  {
    pathname: '/logs',
    label: 'Logs',
    icon: <LogIcon />,
  },
  {
    pathname: '/shelves',
    label: 'Shelves',
    icon: <ShelfIcon />,
  },
  {
    pathname: '/cellars',
    label: 'Cellars',
    icon: <CellarIcon />,
  },
]

@withRouter
@withStyles(theme => ({
  root: {
    height: '100%',
  },
  paper: {
    position: 'static',
    display: 'flex',
    height: '100%',
    flexGrow: '0',
    flexDirection: 'column',
    width: '16em',
    maxWidth: 'calc(100vw - 4em)',
  },
  menu: {
    flexGrow: 0,
  },
  listBottom: {
    flexGrow: 0,
    marginTop: 'auto',
  },
}))
@view
export default class Sidebar extends Component {
  render() {
    const {classes} = this.props
    const {open} = uiStore.sidebar

    return (
      <Fragment>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor="left"
            open={open}
            className={classes.root}
            classes={{
              paper: classes.paper,
            }}
            onClose={this.handleClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {this.renderSidebar()}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            anchor="left"
            open
            className={classes.root}
            classes={{
              paper: classes.paper,
            }}
          >
            {this.renderSidebar()}
          </Drawer>
        </Hidden>
      </Fragment>
    )
  }

  renderSidebar() {
    const {classes} = this.props

    return (
      <Fragment>
        <Hidden mdUp>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                component={Link}
                to="/"
                aria-label="Pinarium"
                color="inherit"
              >
                <LogoIcon />
              </IconButton>
              <Typography color="inherit" variant="title">
                Pinarium
              </Typography>
            </Toolbar>
          </AppBar>
        </Hidden>
        {user.signedIn ? (
          <MenuList role="menu" className={classes.menu}>
            {routes.map(route => (
              <Route
                key={route.pathname}
                path={route.pathname}
                children={({match}) => (
                  <MenuItem
                    selected={null !== match}
                    component={Link}
                    to={route.pathname}
                    onClick={this.handleClose}
                  >
                    <ListItemIcon>{route.icon}</ListItemIcon>
                    <ListItemText primary={route.label} />
                  </MenuItem>
                )}
              />
            ))}
          </MenuList>
        ) : null}
        <List className={classes.listBottom}>
          <ListItem
            button
            component="a"
            href="https://github.com/carab/Pinarium"
          >
            <ListItemIcon>
              <BugIcon />
            </ListItemIcon>
            <ListItemText primary="Report a bug" />
          </ListItem>
        </List>
      </Fragment>
    )
  }

  handleClose = () => {
    uiStore.sidebar.toggle()
  }
}
