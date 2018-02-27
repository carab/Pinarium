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
import AccountCircle from 'material-ui-icons/AccountCircle'
import PowerSettingsNew from 'material-ui-icons/PowerSettingsNew'
import Settings from 'material-ui-icons/Settings'

import user from '../stores/user'

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
          {user.signedIn ? (
            <div className={classes.menu}>
              <IconButton
                aria-owns={open ? 'user-menu' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
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
                    <Settings />
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
                    <PowerSettingsNew />
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
