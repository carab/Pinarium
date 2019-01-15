import React, {useEffect, useState, useCallback} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next/hooks'
import {Router, navigate} from '@reach/router'
import keycode from 'keycode'
import Downshift from 'downshift'
import {makeStyles} from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import Fade from '@material-ui/core/Fade'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'

import {SaveIcon} from '../ui/Icons'
import SearchDialog from '../search/SearchDialog'
import FieldRenderer from '../field/FieldRenderer'

import {format} from '../lib/date'
import ui from '../stores/ui'
import {useSearch, ENUMS} from '../stores/searchStore'
import searchesStore from '../stores/searchesStore'
import {useCellars} from '../stores/cellarsStore'
import {useAutocompletes} from '../stores/autocompletesStore'
import useLocale from '../hooks/useLocale'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    position: 'relative',
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
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
}))

export default observer(function Searchbar({open}) {
  const classes = useStyles()
  const Search = useSearch()
  const [ref, setRef] = useState(null)

  const handleKeyDown = event => {
    if (
      Search.filters.length &&
      !Search.input.length &&
      keycode(event) === 'backspace'
    ) {
      Search.filters.pop()
      navigate(`/bottles/${Search.query}`, {replace: true})
    }
  }

  const handleInputChange = event => {
    Search.input = event.target.value
  }

  const handleChange = ({name, value}) => {
    Search.filters.push([name, value])
    navigate(`/bottles/${Search.query}`, {replace: true})

    ref.focus()
    Search.input = ''
  }

  const handleDelete = item => () => {
    const index = Search.filters.indexOf(item)
    Search.filters.splice(index, 1)
    navigate(`/bottles/${Search.query}`, {replace: true})
    ref.focus()
  }

  const handleSearchChange = Search => {}

  const handleRef = ref => {
    setRef(ref)
  }

  const setMatcher = useCallback(
    (name, matcher) => (Search.matchers[name] = matcher)
  )

  return (
    <>
      <Router primary={false}>
        <SearchParser path="/bottles/:query" onChange={handleSearchChange} />
      </Router>
      {Search.input.length > 1 ? (
        <SearchSuggestionsProvider
          query={Search.input}
          setMatcher={setMatcher}
        />
      ) : null}
      <Fade in={open} mountOnEnter unmountOnExit>
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
              <div className={classes.container}>
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
          <SearchSave />
        </div>
      </Fade>
    </>
  )
})

const SearchSuggestionsProvider = observer(function({setMatcher}) {
  const [cellars] = useCellars()
  const [autocompletes] = useAutocompletes()
  const [t] = useTranslation()
  console.log('-- providing search')
  useEffect(() => {
    //Search.translate = t

    setMatcher('enum', ({name, type}, match) => {
      return ENUMS[name]
        .filter(value => match(t(`enum.${name}.${value}`)))
        .map(value => ({
          name,
          type,
          value,
          printable: t(`enum.${name}.${value}`),
        }))
    })

    setMatcher('cellar', ({name, type}, match) => {
      return cellars
        .filter(cellar => match(cellar.name))
        .map(cellar => ({
          name,
          type,
          value: cellar.$ref.id,
          printable: cellar.name,
        }))
    })

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
        }))
    })
  })

  return null
})

const SearchSave = observer(function() {
  const Search = useSearch()
  const [t] = useTranslation()
  const [search, setSearch] = useState(null)

  const handleOpen = event => {
    const search = searchesStore.create()
    search.query = Search.query
    setSearch(search)
  }

  const handleClose = () => {
    setSearch(null)
  }

  return (
    <>
      <IconButton
        type="submit"
        color="inherit"
        disabled={Search.filters.length === 0}
        title={t('label.save')}
        aria-label={t('label.save')}
        onClick={handleOpen}
      >
        <SaveIcon />
      </IconButton>
      <SearchDialog search={search} onClose={handleClose} />
    </>
  )
})

const SearchParser = observer(function({query}) {
  const search = useSearch()

  useEffect(
    () => {
      search.query = query
      if (search.filters.length) {
        ui.toggleSearchbar(true)
      }
    },
    [query]
  )

  return null
})

const SearchInput = observer(function({setRef, onDelete, classes, ...props}) {
  const [t] = useTranslation()
  const Search = useSearch()

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
  )
})

function SearchSuggestion({
  suggestion,
  index,
  highlightedIndex,
  // selectedItem,
  ...props
}) {
  const [t] = useTranslation()
  const isHighlighted = highlightedIndex === index

  return (
    <MenuItem
      {...props}
      selected={isHighlighted}
      component="div"
    >
      <strong>{suggestion.printable}</strong>
      <em style={{opacity: 0.5}}>
        <span style={{padding: '0 0.5em'}}>―</span>
        {t(`bottle.${suggestion.name}`)}
      </em>
    </MenuItem>
  )
}
