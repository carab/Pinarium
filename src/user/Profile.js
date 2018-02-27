import React, {Component} from 'react'
import {view} from 'react-easy-state'
import List, {ListItem, ListItemText} from 'material-ui/List'

import user from '../stores/user'

@view
export default class Profile extends Component {
  render() {
    const {
      displayName,
      email,
      emailVerified,
      providerData: {providerId},
    } = user.info

    return (
      <List>
        <ListItem>
          <ListItemText
            primary="Name"
            secondary={displayName ? displayName : 'None'}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Email" secondary={email} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Email verified"
            secondary={emailVerified ? 'Yes' : 'No'}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Account type" secondary={providerId} />
        </ListItem>
      </List>
    )
  }
}
