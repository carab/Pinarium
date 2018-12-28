import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next/hooks'
import Downshift from 'downshift'
import {makeStyles} from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import MenuList from '@material-ui/core/MenuList'

import TextField from './TextField'
import {DeleteIcon} from '../ui/Icons'

import {useAutocompletes} from '../stores/autocompletesStore'

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
  namespace,
  onChange,
  InputProps,
  children,
  ...props
}) {
  const classes = useStyles()

  const getSuggestions = useAutocompletes(namespace)

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
              <SuggestionsRenderer
                getSuggestions={getSuggestions}
                value={inputValue}
              >
                {(suggestion, index) => (
                  <SuggestionRenderer
                    key={suggestion.$ref.id}
                    {...{
                      suggestion,
                      index,
                      highlighted: highlightedIndex === index,
                      selected:
                        (selectedItem || '').indexOf(suggestion.value) > -1,
                      onDelete: () => suggestion.$ref.delete(),
                      itemProps: getItemProps({item: suggestion.value}),
                    }}
                  />
                )}
              </SuggestionsRenderer>
            ) : null}
          </div>
        </div>
      )}
    </Downshift>
  )
}

const SuggestionsRenderer = observer(function({
  getSuggestions,
  value,
  children,
}) {
  const classes = useStyles()

  const suggestions = getSuggestions(value)

  if (suggestions.length === 0) {
    return null
  }

  return (
    <Paper className={classes.paper} square>
      <MenuList>{suggestions.map(children)}</MenuList>
    </Paper>
  )
})

function SuggestionRenderer({
  suggestion,
  itemProps,
  highlighted,
  selected,
  onDelete,
}) {
  const [t] = useTranslation()
  const title = t('form.autocomplete.delete')

  return (
    <MenuItem
      {...itemProps}
      selected={highlighted}
      component="div"
      style={{
        fontWeight: selected ? 500 : 400,
      }}
    >
      <ListItemText primary={suggestion.value} />
      <ListItemSecondaryAction>
        <IconButton
          size="small"
          aria-label={title}
          title={title}
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
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
