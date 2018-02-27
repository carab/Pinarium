import React, {Component, Fragment} from 'react'
import {view} from 'react-easy-state'
import List, {ListItem, ListItemText} from 'material-ui/List'

import CellarForm from './CellarForm'

import cellars from '../stores/cellars'

@view
export default class CellarList extends Component {
  render() {
    return (
      <Fragment>
        <CellarForm />
        <List>
          {cellars.data.map((cellar) => (
            <ListItem key={cellar.$ref.id}>
              <ListItemText primary={cellar.title} secondary={cellar.description} />
            </ListItem>
          ))}
        </List>
      </Fragment>
    )
  }
}
