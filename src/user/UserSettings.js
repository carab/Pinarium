import React from 'react';
import {observer, useObservable} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';

import CellarRenderer from '../field/CellarRenderer';
import Container from '../ui/Container';
import {EmailIcon, LocaleIcon, CellarIcon, MoreIcon} from '../ui/Icons';
import useAnchor from '../hooks/useAnchor';

import auth from '../stores/auth';
import userStore, {useUser} from '../stores/userStore';
import {useCellars} from '../stores/cellarsStore';
import useLocale from '../hooks/useLocale';
import cleanEtiquettes from '../jobs/cleanEtiquettes';

export default observer(function UserSettings() {
  const [user, ready] = useUser();
  const [t] = useTranslation();
  const [locale] = useLocale();

  const ui = useObservable({
    cellar: {
      open: false,
    },
    locale: {
      open: false,
    },
  });

  if (!auth.user || !ready) {
    return null;
  }

  const handleOpenCellar = event => {
    ui.cellar.open = true;
  };

  const handleCloseCellar = cellar => event => {
    ui.cellar.open = false;
    userStore.update([user], {defaultCellar: cellar});
  };
  const handleOpenLocale = event => {
    ui.locale.open = true;
  };

  const handleCloseLocale = locale => event => {
    ui.locale.open = false;
    userStore.update([user], {locale});
  };

  return (
    <Container title={t('settings.title')} size="sm" actions={<UserMenu />}>
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
                <CellarRenderer value={user.defaultCellar} />
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
              locale ? t(`locale.${locale}`) : t('settings.select_locale')
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
        selected={user.defaultCellar}
        onClose={handleCloseCellar}
      />
      <LocaleDialog
        open={ui.locale.open}
        selected={locale}
        onClose={handleCloseLocale}
      />
    </Container>
  );
});

function LocaleDialog({selected, onClose, ...props}) {
  const [t] = useTranslation();
  const locales = ['en', 'fr'];

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
  );
}

function CellarDialog({selected, onClose, ...props}) {
  const [t] = useTranslation();
  const [cellars] = useCellars();

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
  );
}

const UserMenu = function() {
  const [t] = useTranslation();
  const [anchor, open, onOpen, onClose] = useAnchor();

  async function handleEtiquettesCleaning() {
    onClose();
    console.log('--- starting job ---');
    try {
      await cleanEtiquettes(auth.user.uid);
      console.log('--- job done ---');
    } catch (e) {
      console.error('--- job error ---');
      console.error(e);
    }
  }

  return (
    <>
      <IconButton
        aria-owns={open ? 'menu-user' : undefined}
        aria-haspopup="true"
        onClick={onOpen}
        color="inherit"
        title={t('user.menu.open')}
        aria-label={t('user.menu.open')}
      >
        <MoreIcon />
      </IconButton>
      <Menu
        id="menu-user"
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={onClose}
      >
        <MenuItem onClick={handleEtiquettesCleaning}>
          {t('job.clean_etiquettes')}
        </MenuItem>
      </Menu>
    </>
  );
};
