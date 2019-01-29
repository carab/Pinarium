import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import {Link} from '@reach/router';
import {makeStyles} from '@material-ui/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@material-ui/core';

import SearchForm from '../search/SearchForm';
import {MenuIcon, LogoIcon} from '../ui/Icons';

import uiStore from '../stores/ui';
import {useSelection} from '../stores/selectionStore';
import useSize from '../hooks/useSize';

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  toolbar: {
    paddingRight: theme.spacing.unit,
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actions: {
    marginLeft: 'auto',
    display: 'flex',
  },
}));

export default observer(function Topbar() {
  const classes = useStyles();
  const [t] = useTranslation();
  const isSmall = useSize('sm', 'down');
  const [selection] = useSelection();

  function handleOpenSidebar() {
    uiStore.toggleSidebar(true);
  }

  return (
    <AppBar
      position="absolute"
      className={classes.root}
      color={uiStore.searchBar.open ? 'default' : 'primary'}
    >
      <Toolbar
        disableGutters={!uiStore.sidebar.open}
        className={classes.toolbar}
      >
        {isSmall ? (
          selection.length === 0 ? (
            <IconButton
              color="inherit"
              aria-label={t('topbar.open_sidebar')}
              title={t('topbar.open_sidebar')}
              onClick={handleOpenSidebar}
              className={classes.button}
            >
              <MenuIcon />
            </IconButton>
          ) : null
        ) : (
          <>
            <IconButton
              color="inherit"
              aria-label={t('topbar.home')}
              title={t('topbar.home')}
              className={classes.button}
              component={Link}
              to="/"
            >
              <LogoIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              {t('topbar.title')}
            </Typography>
            <SearchForm />
          </>
        )}
        <div ref={ref => (uiStore.topbar.titleRef = ref)} />
        <div className={classes.actions}>
          <div ref={ref => (uiStore.topbar.actionsRef = ref)} />
        </div>
      </Toolbar>
    </AppBar>
  );
});
