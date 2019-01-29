import React, {memo} from 'react';
import {navigate, Router} from '@reach/router';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import {makeStyles} from '@material-ui/styles';
import {Typography, Checkbox, IconButton, Hidden} from '@material-ui/core';

import Container from '../ui/Container';
import {CloseIcon} from '../ui/Icons';
import BottleMenu from './BottleMenu';
import BottleListMenu from './BottleListMenu';
import BottleList from './BottleList';
import BottleTable from './BottleTable';
import SearchDrawerToggle from '../search/SearchDrawerToggle';

import useSize from '../hooks/useSize';
import {useBottles} from '../stores/bottlesStore';
import {useSearchProvider, useSearchQuery} from '../stores/searchStore';
import {useSelectionProvider} from '../stores/selectionStore';

const useStyle = makeStyles(theme => ({
  emptyMessage: {
    textAlign: 'center',
    padding: theme.spacing.unit * 2,
  },
  selectAll: {
    marginRight: theme.spacing.unit,
  },
}));

function BottlePage() {
  const classes = useStyle();
  const [t] = useTranslation();
  const isSmall = useSize('sm', 'down');
  const [bottles, ready] = useBottles();
  const [filtered] = useSearchProvider(bottles);
  const [selection, select, unselect] = useSelectionProvider(filtered);

  const countAll = filtered.length;
  const countSelected = selection.length;
  const areAllSelected = countSelected === countAll && countAll >= 1;
  const areSomeSelected = !areAllSelected && countSelected >= 1;

  function handleUnselectAll() {
    unselect();
  }

  function handleSelectAll() {
    if (areAllSelected) {
      unselect();
    } else {
      select();
    }
  }

  if (!ready) {
    return null;
  }

  return (
    <>
      <Router>
        <QueryProvider path="*" />
      </Router>
      <Container
        highlighted={countSelected > 0}
        title={
          countSelected > 0 ? (
            <>
              <Checkbox
                className={classes.selectAll}
                indeterminate={areSomeSelected}
                checked={areAllSelected}
                onChange={handleSelectAll}
                inputProps={{
                  'aria-label': areAllSelected
                    ? t('bottle.list.unselectAll')
                    : t('bottle.list.selectAll'),
                }}
                color="primary"
              />
              {t('bottle.list.selected', {count: countSelected})}
            </>
          ) : (
            t('bottle.list.title', {count: countAll})
          )
        }
        actions={
          countSelected > 0 ? (
            <>
              <IconButton
                onClick={handleUnselectAll}
                color="inherit"
                title={t('bottle.list.unselectAll')}
              >
                <CloseIcon />
              </IconButton>
              <BottleMenu bottles={selection} />
            </>
          ) : isSmall ? (
            <SearchDrawerToggle />
          ) : (
            <BottleListMenu />
          )
        }
      >
        {filtered.length ? (
          <>
            <Hidden mdUp>
              <BottleList bottles={filtered} />
            </Hidden>
            <Hidden smDown>
              <BottleTable bottles={filtered} />
            </Hidden>
          </>
        ) : (
          <Typography className={classes.emptyMessage}>
            {t('bottle.list.empty')}
          </Typography>
        )}
      </Container>
    </>
  );
}

export default observer(BottlePage);

function QueryProvider(props) {
  return <SearchQueryProvider query={props['*']} />;
}

const SearchQueryProvider = observer(function({query = '', ...props}) {
  console.log('SearchQueryProvider');
  console.log(query);
  function handleUpdate(query) {
    navigate(`/bottles/${query}`, {replace: true});
  }

  useSearchQuery(query, handleUpdate);

  return null;
});
