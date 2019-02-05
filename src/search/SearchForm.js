import React, {useEffect, useState, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import classnames from 'classnames';
import {useTranslation} from 'react-i18next/hooks';
import keycode from 'keycode';
import Downshift from 'downshift';
import {fade} from '@material-ui/core/styles/colorManipulator';
import {makeStyles} from '@material-ui/styles';
import {
  Paper,
  ListItemText,
  MenuItem,
  Chip,
  Input,
  InputBase,
} from '@material-ui/core';

import FieldRenderer from '../field/FieldRenderer';
import {SearchIcon} from '../ui/Icons';

import {useSearch, ENUMS} from '../stores/searchStore';
import {useCellars} from '../stores/cellarsStore';
import {useAutocompletes} from '../stores/autocompletesStore';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  container: {
    position: 'relative',
    minWidth: theme.spacing.unit * 50,
  },
  fullContainer: {
    minWidth: 'auto',
    width: '100%',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    minHeight: 40,
    flexWrap: 'wrap',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.25),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.4),
    },
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
    color: 'inherit',
    marginLeft: theme.spacing.unit,
  },
  inputIcon: {
    margin: `0 ${theme.spacing.unit}px`,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
}));

export default observer(function SearchForm({fullWidth}) {
  const classes = useStyles();
  const Search = useSearch();
  const [ref, setRef] = useState(null);

  const handleKeyDown = event => {
    if (
      Search.filters.length &&
      !Search.input.length &&
      keycode(event) === 'backspace'
    ) {
      Search.filters.pop();
    }
  };

  const handleInputChange = event => {
    Search.input = event.target.value;
  };

  const handleChange = ({name, value}) => {
    Search.filters.push([name, value]);
    Search.input = '';
    ref.focus();
  };

  const handleDelete = item => () => {
    const index = Search.filters.indexOf(item);
    Search.filters.splice(index, 1);
    ref.focus();
  };

  const handleRef = ref => {
    setRef(ref);
  };

  const setMatcher = useCallback(
    (name, matcher) => (Search.matchers[name] = matcher)
  );

  const containerClasses = classnames(classes.container, {
    [classes.fullContainer]: fullWidth,
  });

  return (
    <>
      {Search.input.length > 1 ? (
        <SearchSuggestionsProvider
          query={Search.input}
          setMatcher={setMatcher}
        />
      ) : null}
      <div className={classes.root}>
        <Downshift
          inputValue={Search.input}
          onChange={handleChange}
          selectedItem={Search.filters}
          defaultHighlightedIndex={0}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            //inputValue,
            //selectedItem,
            highlightedIndex,
          }) => (
            <div className={containerClasses}>
              <SearchInput
                {...getInputProps({
                  setRef: handleRef,
                  onChange: handleInputChange,
                  onKeyDown: handleKeyDown,
                  classes: classes,
                  onDelete: handleDelete,
                })}
              />
              {isOpen ? (
                <Paper className={classes.paper} square>
                  {Search.suggestions.map((suggestion, index) => (
                    <SearchSuggestion
                      suggestion={suggestion}
                      key={index}
                      index={index}
                      highlightedIndex={highlightedIndex}
                      // selectedItem={Search.filters}
                      {...getItemProps({item: suggestion})}
                    />
                  ))}
                </Paper>
              ) : null}
            </div>
          )}
        </Downshift>
      </div>
    </>
  );
});

const SearchSuggestionsProvider = observer(function({setMatcher}) {
  const [cellars] = useCellars();
  const [autocompletes] = useAutocompletes();
  const [t] = useTranslation();

  useEffect(() => {
    setMatcher('enum', ({name, type}, match) => {
      return ENUMS[name]
        .filter(value => match(t(`enum.${name}.${value}`)))
        .map(value => ({
          name,
          type,
          value,
          printable: t(`enum.${name}.${value}`),
        }));
    });

    setMatcher('cellar', ({name, type}, match) => {
      return cellars
        .filter(cellar => match(cellar.name))
        .map(cellar => ({
          name,
          type,
          value: cellar.$ref.id,
          printable: cellar.name,
        }));
    });

    setMatcher('autocomplete', ({name, type}, match) => {
      return autocompletes
        .filter(
          autocomplete =>
            autocomplete.namespace === name && match(autocomplete.value)
        )
        .map(autocomplete => ({
          name,
          type,
          value: autocomplete.value,
          printable: autocomplete.value,
        }));
    });
  });

  return null;
});

const SearchInput = observer(function({setRef, onDelete, classes, ...props}) {
  const [t] = useTranslation();
  const Search = useSearch();

  return (
    <div className={classes.inputRoot}>
      {Search.filters.map(item => (
        <Chip
          color="primary"
          key={item[0]}
          tabIndex={-1}
          label={
            <FieldRenderer name={item[0]} value={item[1]} namespace="bottle" />
          }
          className={classes.chip}
          onDelete={onDelete(item)}
        />
      ))}
      <div className={classes.inputContainer}>
        <InputBase
          inputRef={setRef}
          fullWidth
          autoFocus
          className={classes.inputInput}
          placeholder={t('searchbar.title')}
          {...props}
        />
        <SearchIcon className={classes.inputIcon} />
      </div>
    </div>
  );

  return (
    <Input
      inputRef={setRef}
      fullWidth
      autoFocus
      startAdornment={Search.filters.map(item => (
        <Chip
          color="primary"
          key={item[0]}
          tabIndex={-1}
          label={
            <FieldRenderer name={item[0]} value={item[1]} namespace="bottle" />
          }
          className={classes.chip}
          onDelete={onDelete(item)}
        />
      ))}
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
      placeholder={t('searchbar.title')}
      {...props}
    />
  );
});

function SearchSuggestion({
  suggestion,
  index,
  highlightedIndex,
  // selectedItem,
  ...props
}) {
  const [t] = useTranslation();
  const isHighlighted = highlightedIndex === index;

  return (
    <MenuItem {...props} selected={isHighlighted} component="div">
      <ListItemText
        primary={suggestion.printable}
        secondary={t(`bottle.${suggestion.name}`)}
      />
      {/* <strong>{suggestion.printable}</strong>
      <em style={{opacity: 0.5}}>
        <span style={{padding: '0 0.5em'}}>―</span>
        {t(`bottle.${suggestion.name}`)}
      </em> */}
    </MenuItem>
  );
}
