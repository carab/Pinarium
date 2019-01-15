import React from 'react'
import {observer} from 'mobx-react-lite'
import {Trans} from 'react-i18next/hooks'
import {Link} from '@reach/router'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'

import Container from '../ui/Container'
import {ViewIcon} from '../ui/Icons'

import {useCellars} from '../stores/cellarsStore'

function CellarList() {
  const [cellars] = useCellars()

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
            <ListItemSecondaryAction>
              <IconButton
                component={Link}
                to={`/bottles/cellar=${cellar.$ref.id}`}
              >
                <ViewIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export default observer(CellarList)
