import React from 'react'
import {observer, useObservable} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next/hooks'
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
  const [user, ready] = useUser()
  const [t, i18n] = useTranslation()

  const ui = useObservable({
    cellar: {
      open: false,
    },
    locale: {
      open: false,
    },
  })

  if (!auth.user || !ready) {
    return null
  }

  const handleOpenCellar = event => {
    ui.cellar.open = true
  }

  const handleCloseCellar = cellar => event => {
    ui.cellar.open = false
    userStore.update([user], {defaultCellar: cellar})
  }
  const handleOpenLocale = event => {
    ui.locale.open = true
  }

  const handleCloseLocale = locale => event => {
    ui.locale.open = false
    userStore.update([user], {locale})
  }

  const currentLocale = user.locale || i18n.languages[0].substring(0, 2)

  return (
    <Container title={t('settings.title')} size="sm">
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
          aria-label={t('settings.select_default_cellar')}
          onClick={handleOpenCellar}
        >
          <ListItemIcon>
            <CellarIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('settings.default_cellar')}
            secondary={
              user.defaultCellar ? (
                <CellarRenderer $ref={user.defaultCellar} />
              ) : (
                t('settings.select_default_cellar')
              )
            }
          />
        </ListItem>
        <ListItem
          button
          aria-label={t('settings.select_locale')}
          onClick={handleOpenLocale}
        >
          <ListItemIcon>
            <LocaleIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('settings.locale')}
            secondary={
              currentLocale
                ? t(`locale.${currentLocale}`)
                : t('settings.select_locale')
            }
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
        open={ui.cellar.open}
        cellars={cellars}
        selected={user.defaultCellar}
        onClose={handleCloseCellar}
      />
      <LocaleDialog
        open={ui.locale.open}
        locales={['en', 'fr']}
        selected={currentLocale}
        onClose={handleCloseLocale}
      />
    </Container>
  )
})

function LocaleDialog({locales, selected, onClose, ...props}) {
  const [t] = useTranslation()

  return (
    <Dialog
      onClose={onClose(selected)}
      aria-labelledby="locale-dialog-title"
      {...props}
    >
      <DialogTitle id="locale-dialog-title">
        {t('settings.select_locale')}
      </DialogTitle>
      <MenuList>
        {locales.map(locale => (
          <MenuItem
            key={locale}
            selected={locale === selected}
            onClick={onClose(locale)}
          >
            {t(`locale.${locale}`)}
          </MenuItem>
        ))}
      </MenuList>
    </Dialog>
  )
}

function CellarDialog({cellars, selected, onClose, ...props}) {
  const [t] = useTranslation()

  return (
    <Dialog
      onClose={onClose(selected)}
      aria-labelledby="cellar-dialog-title"
      {...props}
    >
      <DialogTitle id="cellar-dialog-title">
        {t('settings.select_default_cellar')}
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
  const [cellar] = useCellar($ref)

  if (cellar) {
    return cellar.name
  }

  return null
})
