import React, {Component, Fragment} from 'react'
import {view} from 'react-easy-state'
import List, {ListItem, ListItemText} from 'material-ui/List'

import CellarForm from './CellarForm'

import provideCellars from '../providers/provideCellars'
import cellars from '../stores/cellars'

@provideCellars
@view
export default class CellarList extends Component {
  render() {
    return (
      <Fragment>
        <CellarForm />
        <List>
          {cellars.all.map((cellar) => (
            <ListItem key={cellar.$ref.id}>
              <ListItemText primary={cellar.title} secondary={cellar.description} />
            </ListItem>
          ))}
        </List>
      </Fragment>
    )
  }
}
