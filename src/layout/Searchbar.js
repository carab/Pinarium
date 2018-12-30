import React, {useEffect, useState} from 'react'
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

import ui from '../stores/ui'
import {useSearch} from '../stores/searchStore'
import searchesStore from '../stores/searchesStore'

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

export default observer(function Searchbar() {
  const classes = useStyles()
  const search = useSearch()
  const [ref, setRef] = useState(null)

  const handleKeyDown = event => {
    if (
      search.filters.length &&
      !search.input.length &&
      keycode(event) === 'backspace'
    ) {
      search.filters.pop()
      navigate(`/bottles/${search.query}`, {replace: true})
    }
  }

  const handleInputChange = event => {
    search.input = event.target.value
  }

  const handleChange = ({name, value}) => {
    search.filters.push([name, value])
    navigate(`/bottles/${search.query}`, {replace: true})

    ref.focus()
    search.input = ''
  }

  const handleDelete = item => () => {
    const index = search.filters.indexOf(item)
    search.filters.splice(index, 1)
    navigate(`/bottles/${search.query}`, {replace: true})
    ref.focus()
  }

  const handleSearchChange = search => {
    console.log(search)
  }

  const handleRef = ref => {
    setRef(ref)
  }

  return (
    <>
      <Router>
        <SearchParser path="/bottles/:query" onChange={handleSearchChange} />
      </Router>
      <Fade in={ui.searchbar.open} mountOnEnter unmountOnExit>
        <div className={classes.root}>
          <Downshift
            inputValue={search.input}
            onChange={handleChange}
            selectedItem={search.filters}
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
                    {search.suggestions.map((suggestion, index) => (
                      <SearchSuggestion
                        suggestion={suggestion}
                        key={index}
                        index={index}
                        highlightedIndex={highlightedIndex}
                        // selectedItem={search.filters}
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
  const search = useSearch()

  return (
    <Input
      inputRef={setRef}
      fullWidth
      autoFocus
      startAdornment={search.filters.map(item => (
        <Chip
          color="primary"
          key={item[0]}
          tabIndex={-1}
          label={item[1]}
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

// const SearchItem = observer(function() {
//   return (
//     <Chip
//       key={item.name}
//       tabIndex={-1}
//       label={`${item.name}:${item.value}`}
//       className={classes.chip}
//       onDelete={onDelete(item)}
//     />
//   )
// })

function SearchSuggestion({
  suggestion,
  index,
  highlightedIndex,
  // selectedItem,
  ...props
}) {
  const [t] = useTranslation()
  const isHighlighted = highlightedIndex === index
  //const isSelected = (selectedItem || '').indexOf(suggestion.name) > -1

  return (
    <MenuItem
      {...props}
      selected={isHighlighted}
      component="div"
      // style={{
      //   fontWeight: isSelected ? 500 : 400,
      // }}
    >
      <strong>{suggestion.value}</strong>
      <em style={{opacity: 0.5}}>
        <span style={{padding: '0 0.5em'}}>―</span>
        {t(`bottle.${suggestion.name}`)}
      </em>
    </MenuItem>
  )
}
