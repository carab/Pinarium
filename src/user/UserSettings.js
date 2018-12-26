import React, {useState} from 'react'
import {observer} from 'mobx-react-lite'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import Container from '../ui/Container'
import {EmailIcon, LocaleIcon, CellarIcon} from '../ui/Icons'

import auth from '../stores/auth'
import userStore, {useUser} from '../stores/userStore'
import {useCellars, useCellar} from '../stores/cellars'

export default observer(function UserSettings() {
  const cellars = useCellars()
  const user = useUser()
  
  const [anchorEl, setAnchorEl] = useState(null)

  if (null === user) {
    return null
  }

  const handleOpenCellars = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleSelectCellar = (event, cellar) => {
    userStore.update([user], {defaultCellar: cellar})
    setAnchorEl(null)
  }

  const handleCloseCellars = () => {
    setAnchorEl(null)
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
          aria-haspopup="true"
          aria-controls="default-cellar-menu"
          aria-label="Default cellar"
          onClick={handleOpenCellars}
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
      <Menu
        id="default-cellar-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseCellars}
      >
        {cellars.map(cellar => (
          <MenuItem
            key={cellar.$ref.id}
            selected={
              cellar.$ref.id === (user.defaultCellar && user.defaultCellar.id)
            }
            onClick={event => handleSelectCellar(event, cellar.$ref)}
          >
            {cellar.name}
          </MenuItem>
        ))}
      </Menu>
    </Container>
  )
})

const CellarRenderer = observer(function({$ref}) {
  const cellar = useCellar($ref)

  if (cellar) {
    return cellar.name
  }

  return null
})
