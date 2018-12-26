import React from 'react'
import TextField from './TextField'
import deburr from 'lodash/deburr'
import Downshift from 'downshift'
import {makeStyles} from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 250,
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

export default function AutocompleteField({
  value,
  name,
  renderSuggestions,
  onChange,
  InputProps,
  children,
  ...props
}) {
  const classes = useStyles()

  const handleChange = selectedItem => {
    const value = selectedItem === '' ? null : selectedItem
    onChange(value, name)
  }

  const handleInputChange = value => {
    onChange(value, name)
  }

  return (
    <Downshift
      inputValue={value || ''}
      defaultHighlightedIndex={0}
      selectedItem={value}
      onChange={handleChange}
      onInputValueChange={handleInputChange}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        getLabelProps,
        highlightedIndex,
        inputValue,
        isOpen,
        selectedItem,
      }) => (
        <div className={classes.container}>
          {renderInput({
            fullWidth: true,
            classes,
            InputProps: getInputProps(InputProps),
            InputLabelProps: getLabelProps(),
            ...props,
          })}
          <div {...getMenuProps()}>
            {isOpen ? (
              <Paper className={classes.paper} square>
                {children({
                  search: inputValue,
                  renderSuggestion: (suggestion, index) =>
                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({item: suggestion.label}),
                      highlightedIndex,
                      selectedItem,
                    }),
                })}
              </Paper>
            ) : null}
          </div>
        </div>
      )}
    </Downshift>
  )
}

function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
}) {
  const isHighlighted = highlightedIndex === index
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  )
}

function renderInput({InputProps, classes, ref, ...other}) {
  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  )
}
