import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {view} from 'react-easy-state'
import {withStyles} from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import Divider from 'material-ui/Divider'
import List, {ListItem, ListItemText, ListItemIcon} from 'material-ui/List'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import BugReportIcon from 'material-ui-icons/BugReport'
import LayersIcon from 'material-ui-icons/Layers'
import ListIcon from 'material-ui-icons/List'
import LocalBarIcon from 'material-ui-icons/LocalBar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'

import user from '../stores/user'

@withStyles(theme => ({
  drawerPaper: {
    position: 'relative',
  },
  header: {
    background: 'none',
  },
  list: {
    flexGrow: 0,
  }
}))
@view
export default class Main extends Component {
  render() {
    const {classes} = this.props

    return (
      <Drawer
        variant="permanent"
        anchor="left"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <AppBar position="static" className={classes.header}>
          <Toolbar>
            <IconButton
              component={Link}
              to="/"
              aria-label="Pinarium"
              color="primary"
            >
              <LocalBarIcon />
            </IconButton>
            <Typography variant="title">Pinarium</Typography>
          </Toolbar>
        </AppBar>
        {user.signedIn ? (
          <List className={classes.list}>
            <ListItem button component={Link} to="/cellars">
              <ListItemIcon>
                <LayersIcon />
              </ListItemIcon>
              <ListItemText primary="Cellars" />
            </ListItem>
            <ListItem button component={Link} to="/crates">
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="Crates" />
            </ListItem>
          </List>
        ) : null}
        <Divider />
        <List className={classes.list}>
          <ListItem
            button
            component="a"
            href="https://github.com/carab/Pinarium"
          >
            <ListItemIcon>
              <BugReportIcon />
            </ListItemIcon>
            <ListItemText primary="Report a bug" />
          </ListItem>
        </List>
      </Drawer>
    )
  }
}
