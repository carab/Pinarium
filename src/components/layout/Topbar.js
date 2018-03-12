import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {view} from 'react-easy-state'
import {withStyles} from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Menu, {MenuItem} from 'material-ui/Menu'
import {ListItemIcon, ListItemText} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Hidden from 'material-ui/Hidden'
import Typography from 'material-ui/Typography'

import {
  LogoIcon,
  MenuIcon,
  UserIcon,
  SettingsIcon,
  SignoutIcon,
} from '../ui/Icons'

import user from '../../stores/user'
import uiStore from '../../stores/uiStore'

@withStyles(theme => ({
  menu: {
    marginLeft: 'auto',
  },
}))
@view
export default class Topbar extends Component {
  state = {
    anchorEl: null,
  }

  handleOpenSidebar = () => {
    uiStore.sidebar.toggle()
  }

  handleMenu = event => {
    this.setState({anchorEl: event.currentTarget})
  }

  handleClose = () => {
    this.setState({anchorEl: null})
  }

  render() {
    const {classes} = this.props
    const {anchorEl} = this.state
    const open = Boolean(anchorEl)

    return (
      <AppBar position="static">
        <Toolbar>
          <Hidden mdUp>
            <IconButton
              color="inherit"
              aria-label="Open sidebar"
              onClick={this.handleOpenSidebar}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Hidden smDown>
            <IconButton
              color="inherit"
              component={Link}
              to="/"
              aria-label="Pinarium"
            >
              <LogoIcon />
            </IconButton>
            <Typography color="inherit" variant="title">
              Pinarium
            </Typography>
          </Hidden>
          {user.signedIn ? (
            <div className={classes.menu}>
              <IconButton
                aria-owns={open ? 'user-menu' : null}
                aria-haspopup="true"
                aria-label="Open user menu"
                onClick={this.handleMenu}
                color="inherit"
              >
                <UserIcon />
              </IconButton>
              <Menu
                id="user-menu"
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
                <MenuItem
                  component={Link}
                  to="/profile"
                  onClick={this.handleClose}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </MenuItem>
                <Divider />
                <MenuItem
                  component={Link}
                  to="/signout"
                  onClick={this.handleClose}
                >
                  <ListItemIcon>
                    <SignoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sign out" />
                </MenuItem>
              </Menu>
            </div>
          ) : null}
        </Toolbar>
      </AppBar>
    )
  }
}
