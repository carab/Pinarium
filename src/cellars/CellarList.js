import React from 'react'
import {observer} from 'mobx-react-lite'
import {Trans} from 'react-i18next/hooks'
import {Link} from '@reach/router'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import Container from '../ui/Container'

import {useCellars} from '../stores/cellars'

export default observer(function CellarList() {
  const cellars = useCellars()

  return (
    <Container
      size="sm"
      title={<Trans i18nKey="cellar.list.title" />}
      actions={null}
    >
      <List>
        {cellars.map(cellar => (
          <ListItem
            key={cellar.$ref.id}
            button
            component={Link}
            to={`/cellar/${cellar.$ref.id}`}
          >
            <ListItemText
              primary={cellar.name}
              secondary={cellar.description}
            />
            {/* <ListItemSecondaryAction>
            <IconButton component={Link} to="/bottles">
              <ViewIcon />
            </IconButton>
          </ListItemSecondaryAction> */}
          </ListItem>
        ))}
      </List>
    </Container>
  )
})
