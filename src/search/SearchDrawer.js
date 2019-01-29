import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import {makeStyles} from '@material-ui/styles';
import {Drawer, Toolbar, IconButton, Typography} from '@material-ui/core';

import {PreviousIcon, ResetIcon} from '../ui/Icons';
import SearchForm from './SearchForm';

import uiStore from '../stores/ui';
import {useSearch} from '../stores/searchStore';

const useStyles = makeStyles(theme => ({
  root: {},
  paper: {
    width: theme.spacing.unit * 40,
    maxWidth: `calc(100vw - ${theme.spacing.unit * 8}px)`,
  },
  previousButton: {},
  resetButton: {
    marginLeft: 'auto',
  },
  toolbar: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
    paddingLeft: theme.spacing.unit / 2,
    paddingRight: theme.spacing.unit / 2,
  },
  content: {
    padding: theme.spacing.unit,
  },
}));

function SearchDrawer() {
  const classes = useStyles();

  function handleClose() {
    uiStore.searchDrawer.open = false;
  }

  return (
    <Drawer
      open={uiStore.searchDrawer.open}
      variant="temporary"
      anchor="right"
      onClose={handleClose}
      className={classes.root}
      classes={{
        paper: classes.paper,
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <SearchDrawerContent onClose={handleClose} />
    </Drawer>
  );
}

export default observer(SearchDrawer);

const SearchDrawerContent = observer(function({onClose}) {
  const classes = useStyles();
  const [t] = useTranslation();
  const search = useSearch();

  const title = t('bottle.list.title', {
    count: search.search.data.items.length,
  });

  function handleReset() {
    search.reset();
  }

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          aria-label={t('topbar.toggle_search')}
          title={t('topbar.toggle_search')}
          onClick={onClose}
          className={classes.previousButton}
        >
          <PreviousIcon />
        </IconButton>
        <Typography variant="h6" color="inherit">
          {title}
        </Typography>
        <IconButton
          color="inherit"
          aria-label={t('search.reset')}
          title={t('search.reset')}
          onClick={handleReset}
          className={classes.resetButton}
        >
          <ResetIcon />
        </IconButton>
      </Toolbar>
      <div className={classes.content}>
        <SearchForm fullWidth />
      </div>
    </>
  );
});
