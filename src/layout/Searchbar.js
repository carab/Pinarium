import React, {useCallback, useState} from 'react'
import {Router, Redirect} from '@reach/router'
import {observer} from 'mobx-react-lite'
import deburr from 'lodash/deburr'
import keycode from 'keycode'
import Downshift from 'downshift'
import {makeStyles} from '@material-ui/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import Fade from '@material-ui/core/Fade'
import Input from '@material-ui/core/Input'

import bottles from '../stores/bottles'
import ui from '../stores/ui'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
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

export default observer(function DownshiftMultiple() {
  const classes = useStyles()

  const handleKeyDown = event => {
    if (
      bottles.autocompleteItems.length &&
      !bottles.autocompleteQuery.length &&
      keycode(event) === 'backspace'
    ) {
      bottles.autocompleteItems.pop()
    }
  }

  const handleInputChange = event => {
    bottles.autocompleteQuery = event.target.value
  }

  const handleChange = item => {
    if (bottles.autocompleteItems.indexOf(item) === -1) {
      bottles.autocompleteItems.push(item)
    }

    bottles.autocompleteQuery = ''
  }

  const handleDelete = item => () => {
    const index = bottles.autocompleteItems.indexOf(item)
    bottles.autocompleteItems.splice(index, 1)
  }

  return (
    <Fade in={ui.searchbar.open} mountOnEnter unmountOnExit>
      <div className={classes.root}>
        <Downshift
          inputValue={bottles.autocompleteQuery}
          onChange={handleChange}
          selectedItem={bottles.autocompleteItems}
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
                  onChange: handleInputChange,
                  onKeyDown: handleKeyDown,
                })}
                classes={classes}
                onDelete={handleDelete}
              />
              {isOpen ? (
                <Paper className={classes.paper} square>
                  {bottles.autocompleteSuggestions.map((suggestion, index) => (
                    <SearchSuggestion
                      suggestion={suggestion}
                      key={index}
                      index={index}
                      highlightedIndex={highlightedIndex}
                      // selectedItem={bottles.autocompleteItems}
                      {...getItemProps({item: suggestion})}
                    />
                  ))}
                </Paper>
              ) : null}
            </div>
          )}
        </Downshift>
      </div>
    </Fade>
  )
})

const SearchInput = observer(function({onDelete, classes, ...props}) {
  return (
    <Input
      fullWidth
      autoFocus
      startAdornment={bottles.autocompleteItems.map(item => (
        <Chip
          color="primary"
          key={item.name}
          tabIndex={-1}
          label={`${item.name}:${item.value}`}
          className={classes.chip}
          onDelete={onDelete(item)}
        />
      ))}
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
      placeholder="Enter your search"
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
      {`${suggestion.name} : ${suggestion.value}`}
    </MenuItem>
  )
}

function getSuggestions(suggestions, value) {
  const inputValue = deburr(value.trim()).toLowerCase()
  const inputLength = inputValue.length
  let count = 0

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue

        if (keep) {
          count += 1
        }

        return keep
      })
}
