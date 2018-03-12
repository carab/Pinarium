import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {view} from 'react-easy-state'
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui/List'
import IconButton from 'material-ui/IconButton'

import {ViewIcon} from '../ui/Icons'
import Container from '../ui/Container'

import cellarsStore from '../../stores/cellarsStore'

@view
export default class CellarList extends Component {
  render() {
    return (
      <Container title="Cellars">
        <List>
          {cellarsStore.list.map(cellar => (
            <ListItem
              key={cellar.$doc.id}
              button
              component={Link}
              to={{
                pathname: `/cellars/${cellar.$doc.id}`,
                state: {modal: true},
              }}
            >
              <ListItemText
                primary={cellar.title}
                secondary={cellar.description}
              />
              <ListItemSecondaryAction>
                <IconButton component={Link} to="/bottles">
                  <ViewIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Container>
    )
  }
}
