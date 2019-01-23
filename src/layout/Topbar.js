import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import {Link} from '@reach/router';
import {makeStyles} from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';

import SearchBar from '../search/SearchBar';
import {MenuIcon, SearchIcon, CloseIcon, LogoIcon} from '../ui/Icons';

import uiStore from '../stores/ui';

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

  function handleOpenSidebar() {
    uiStore.toggleSidebar(true);
  }

  function handleToggleSearchBar() {
    uiStore.toggleSearchBar();
  }

  function handleOpenSearchDrawer() {
    uiStore.searchDrawer.open = true;
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
        <Hidden mdUp>
          <IconButton
            color="inherit"
            aria-label={t('topbar.open_sidebar')}
            title={t('topbar.open_sidebar')}
            onClick={handleOpenSidebar}
            className={classes.button}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Hidden smDown>
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
          <SearchBar />
        </Hidden>
        <Hidden mdUp>
          <div ref={ref => (uiStore.topbar.titleRef = ref)} />
        </Hidden>
        <div className={classes.actions}>
          <Hidden mdUp>
            <IconButton
              color="inherit"
              aria-label={t('topbar.toggle_search')}
              title={t('topbar.toggle_search')}
              onClick={handleOpenSearchDrawer}
            >
              <SearchIcon />
            </IconButton>
            <div ref={ref => (uiStore.topbar.actionsRef = ref)} />
          </Hidden>
          <Hidden smDown>
            <IconButton
              color="inherit"
              aria-label={t('topbar.toggle_search')}
              title={t('topbar.toggle_search')}
              onClick={handleToggleSearchBar}
            >
              {uiStore.searchBar.open ? <CloseIcon /> : <SearchIcon />}
            </IconButton>
          </Hidden>
        </div>
      </Toolbar>
    </AppBar>
  );
});
