import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import {makeStyles} from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';

import Container from '../ui/Container';
import {CloseIcon} from '../ui/Icons';
import BottleMenu from './BottleMenu';
import BottleDialog from './BottleDialog';
import BottleListMenu from './BottleListMenu';
import BottleList from './BottleList';
import BottleTable from './BottleTable';

import {useBottles} from '../stores/bottlesStore';
import {useSearch, useSearchIndex} from '../stores/searchStore';
import {useSelectionProvider} from '../stores/selectionStore';

const useStyle = makeStyles(theme => ({
  emptyMessage: {
    textAlign: 'center',
    padding: theme.spacing.unit * 2,
  },
  selectAll: {
    marginRight: theme.spacing.unit,
    marginLeft: (theme.spacing.unit * -3) / 2,
  },
}));

export default observer(function BottlePage({query}) {
  const Search = useSearch();
  const [bottles, ready] = useBottles(Search.visibility);
  const [filtered] = useSearchIndex(query, bottles);
  const [selection, select, unselect] = useSelectionProvider(filtered);

  const classes = useStyle();
  const [t] = useTranslation();

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
      <BottleDialog />
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
          ) : (
            <Hidden smDown>
              <BottleListMenu />
            </Hidden>
          )
        }
      >
        {filtered.length ? (
          <>
            <Hidden mdUp>
              <BottleList Search={Search} bottles={filtered} />
            </Hidden>
            <Hidden smDown>
              <BottleTable Search={Search} bottles={filtered} />
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
});
