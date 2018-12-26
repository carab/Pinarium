import React, {useState} from 'react'
import {observer, useObservable} from 'mobx-react-lite'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'

import Container from '../ui/Container'
import {EmailIcon, LocaleIcon, CellarIcon} from '../ui/Icons'

import auth from '../stores/auth'
import userStore, {useUser} from '../stores/userStore'
import {useCellars, useCellar} from '../stores/cellars'

export default observer(function UserSettings() {
  const cellars = useCellars()
  const user = useUser()

  const ui = useObservable({
    cellar: {
      open: false,
    },
  })

  if (null === user) {
    return null
  }

  const handleOpenCellar = event => {
    ui.cellar.open = true
  }

  const handleCloseCellar = cellar => event => {
    ui.cellar.open = false
    userStore.update([user], {defaultCellar: cellar})
  }

  return (
    <Container title="Settings" size="sm">
      <List>
        {/* <ListItem>
          <ListItemText
            primary="Name"
            secondary={auth.user.displayName ? auth.user.displayName : 'None'}
          />
        </ListItem> */}
        <ListItem>
          <ListItemIcon>
            <EmailIcon />
          </ListItemIcon>
          <ListItemText primary="Email" secondary={auth.user.email} />
        </ListItem>
        <ListItem
          button
          aria-label="Select default cellar"
          onClick={handleOpenCellar}
        >
          <ListItemIcon>
            <CellarIcon />
          </ListItemIcon>
          <ListItemText
            primary="Default cellar"
            secondary={
              user.defaultCellar ? (
                <CellarRenderer $ref={user.defaultCellar} />
              ) : (
                'Select a default cellar'
              )
            }
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <LocaleIcon />
          </ListItemIcon>
          <ListItemText
            primary="Language"
            secondary={user.locale ? user.locale : 'Select your language'}
          />
        </ListItem>
        {/* <ListItem>
          <ListItemText
            primary="Email verified"
            secondary={auth.user.emailVerified ? 'Yes' : 'No'}
          />
        </ListItem> */}
        {/* <ListItem>
          <ListItemText primary="Account type" secondary={auth.user.providerData.providerId} />
        </ListItem> */}
      </List>
      <CellarDialog
        id="default-cellar-menu"
        open={ui.cellar.open}
        cellars={cellars}
        selected={user.defaultCellar}
        onClose={handleCloseCellar}
      />
    </Container>
  )
})

function CellarDialog({cellars, selected, onClose, ...props}) {
  return (
    <Dialog
      onClose={onClose(selected)}
      aria-labelledby="cellar-dialog-title"
      {...props}
    >
      <DialogTitle id="cellar-dialog-title">
        Select the default cellar
      </DialogTitle>
      <MenuList>
        {cellars.map(cellar => (
          <MenuItem
            key={cellar.$ref.id}
            selected={cellar.$ref.id === (selected && selected.id)}
            onClick={onClose(cellar.$ref)}
          >
            {cellar.name}
          </MenuItem>
        ))}
      </MenuList>
    </Dialog>
  )
}

const CellarRenderer = observer(function({$ref}) {
  const cellar = useCellar($ref)

  if (cellar) {
    return cellar.name
  }

  return null
})
