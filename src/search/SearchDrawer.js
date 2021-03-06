import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import {makeStyles} from '@material-ui/styles';
import {
  Drawer,
  Toolbar,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
} from '@material-ui/core';

import {PreviousIcon, ResetIcon, AscIcon, DescIcon} from '../ui/Icons';
import SelectField from '../form/SelectField';
import SearchForm from './SearchForm';

import uiStore from '../stores/ui';
import {useSearch, VISIBILITIES, SORTABLE_FIELDS} from '../stores/searchStore';

const useStyles = makeStyles(theme => ({
  root: {},
  paper: {
    width: '100%',
    // width: theme.spacing.unit * 40,
    // maxWidth: `calc(100vw - ${theme.spacing.unit * 8}px)`,
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
    // padding: `${theme.spacing.unit * 2}px 0`,
  },
  filters: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px`,
  },
  sorts: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px`,
    padding: theme.spacing.unit * 2,
  },
  visibility: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px`,
    padding: theme.spacing.unit * 2,
    paddingBottom: 0,
  },
}));

function SearchDrawer() {
  const classes = useStyles();

  function handleClose(event) {
    event.preventDefault();
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
    <form onSubmit={onClose} noValidate autoComplete="off">
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
        <Paper className={classes.filters}>
          <SearchForm fullWidth />
        </Paper>
        <Paper className={classes.sorts}>
          <SearchSortForm />
        </Paper>
        <Paper className={classes.visibility}>
          <SearchVisibilityForm />
        </Paper>
      </div>
    </form>
  );
});

const SearchVisibilityForm = observer(function(props) {
  const [t] = useTranslation();
  const search = useSearch();

  function handleChange(event) {
    search.visibility = event.target.value;
  }

  return (
    <RadioGroup
      aria-label={t('search.visibility.title')}
      name="visibility"
      value={search.visibility}
      onChange={handleChange}
    >
      {VISIBILITIES.map(({name, value}) => (
        <FormControlLabel
          key={name}
          value={name}
          control={<Radio />}
          label={t(`search.visibility.${name}`)}
        />
      ))}
    </RadioGroup>
  );
});

const SearchSortForm = observer(function(props) {
  const [t] = useTranslation();
  const search = useSearch();

  return search.sorts.map((sort, index) => {
    const [direction, column] = sort;

    function handleChangeColumn(column) {
      search.setSortColumn(index, column);
    }

    function handleChangeDirection() {
      search.toggleSortDirection(index);
    }

    return (
      <SelectField
        key={index}
        name="sort"
        value={column}
        required
        onChange={handleChangeColumn}
        options={SORTABLE_FIELDS.map(field => ({
          value: field,
          label: t(`bottle.${field}`),
        }))}
        fullWidth
        InputProps={{
          inputProps: {
            'aria-label': t('label.sort_column'),
          },
          startAdornment: (
            <IconButton
              onClick={handleChangeDirection}
              title={t('label.sort_direction')}
              aria-label={t('label.sort_direction')}
              color="secondary"
              aria-pressed={direction}
            >
              {direction ? <AscIcon /> : <DescIcon />}
            </IconButton>
          ),
        }}
      />
    );
  });
});
