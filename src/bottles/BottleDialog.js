import React, {useEffect} from 'react'
import {action} from 'mobx'
import {observer, useObservable} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next/hooks'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import ListSubheader from '@material-ui/core/ListSubheader'
import Badge from '@material-ui/core/Badge'
import {makeStyles} from '@material-ui/styles'
import {Divider} from '@material-ui/core'

import {useBottleFields} from './EtiquetteForm'
import FieldRenderer from '../field/FieldRenderer'
import {AddIcon, ClearIcon, MoreIcon, BottleIcon} from '../ui/Icons'

import autocompletesStore from '../stores/autocompletesStore'
import bottlesStore from '../stores/bottlesStore'
import uiStore from '../stores/ui'
import useAnchor from '../hooks/useAnchor'
import equals from '../lib/equals'

function BottleDialog() {
  const {bottles} = uiStore.dialogs.bottle
  const open = Boolean(bottles.length)
  const state = useObservable({data: {}})

  function onClose() {
    state.data = {}
    uiStore.dialogs.bottle.bottles = []
  }

  async function handleSave(event) {
    event.preventDefault()
    event.stopPropagation()

    try {
      // Preprocess data (eg. for image uploading)
      const data = await bottlesStore.preSave(state.data)

      // Update bottles
      await bottlesStore.update(bottles, data)

      // Update autocompletes
      await autocompletesStore.updateFrom(data, [
        'appellation',
        'cuvee',
        'producer',
        'region',
        'country',
      ])

      onClose(bottles)
    } catch (error) {
      console.error(error)
    }
  }

  function handleCancel() {
    onClose([])
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      scroll="paper"
      PaperProps={{
        component: 'form',
        onSubmit: handleSave,
        noValidate: true,
        autoComplete: 'off',
      }}
      aria-labelledby="bottle-dialog-title"
    >
      <BottleDialogContent
        data={state.data}
        bottles={bottles}
        onCancel={handleCancel}
      />
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  addButton: {
    marginTop: theme.spacing.unit * 2,
    textAlign: 'center',
  },
  addButtonIcon: {
    marginRight: theme.spacing.unit,
  },
  fieldContainer: {
    marginTop: theme.spacing.unit / 2,
  },
  fieldItem: {
    flexGrow: '1',
  },
}))

const BottleDialogContent = observer(function({data, bottles, onCancel}) {
  const classes = useStyles()
  const [t] = useTranslation()
  const [anchor, open, onOpen, onClose] = useAnchor()
  const suggestions = useObservable({})

  useEffect(
    action(() => {
      bottles.forEach(bottle => {
        Object.keys(bottle).forEach(field => {
          if (undefined === suggestions[field]) {
            suggestions[field] = []
          }

          const index = suggestions[field].findIndex(data =>
            equals(data.value, bottle[field])
          )

          if (index === -1) {
            suggestions[field].push({count: 1, value: bottle[field]})
          } else {
            suggestions[field][index].count++
          }
        })
      })
    }),
    []
  )

  function handleCancel() {
    onCancel()
  }

  function handleChange(value, name) {
    data[name] = value
  }

  function handleRemove(name) {
    delete data[name]
  }

  function handleAdd(name) {
    return event => {
      data[name] = null
      onClose(event)
    }
  }

  const [fields] = useBottleFields(data, {}, handleChange)
  const availableFields = Object.keys(fields).filter(
    name => undefined === data[name]
  )

  return (
    <>
      <DialogTitle id="bottle-dialog-title">
        {t('bottle.form.edit', {count: bottles.length})}
      </DialogTitle>
      <DialogContent>
        {Object.keys(data).map(name => (
          <FieldItem
            key={name}
            name={name}
            field={fields[name]}
            value={data[name]}
            suggestions={suggestions[name]}
            onRemove={handleRemove}
            onChange={handleChange}
            classes={classes}
          />
        ))}
        <div className={classes.addButton}>
          <Button
            aria-owns={anchor ? 'bottle-add-field-menu' : undefined}
            aria-haspopup="true"
            onClick={onOpen}
            variant="outlined"
            color="secondary"
          >
            <AddIcon className={classes.addButtonIcon} />
            {t('bottle.dialog.add_field')}
          </Button>
          <Menu
            id="bottle-add-field-menu"
            anchorEl={anchor}
            open={open}
            onClose={onClose}
          >
            {availableFields.map(name => (
              <MenuItem key={name} onClick={handleAdd(name)}>
                {t(`bottle.${name}`)}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>{t('label.cancel')}</Button>
        <Button type="submit" color="primary">
          {t('label.save')}
        </Button>
      </DialogActions>
    </>
  )
})

function FieldItem({
  name,
  field,
  value,
  suggestions,
  onChange,
  onRemove,
  classes,
}) {
  const [anchor, open, onOpen, onClose] = useAnchor()
  const [t] = useTranslation()
  const id = `bottle-field-${name}-menu`

  function handleRemove() {
    onRemove(name)
  }

  function handleChange(value) {
    return event => {
      onClose()
      onChange(value, name)
    }
  }

  return (
    <Grid
      container
      spacing={8}
      alignItems="flex-end"
      className={classes.fieldContainer}
    >
      <Grid item className={classes.fieldItem}>
        {field}
      </Grid>
      <Grid item>
        <IconButton
          aria-owns={anchor ? id : undefined}
          aria-haspopup="true"
          onClick={onOpen}
        >
          <MoreIcon />
        </IconButton>
        <Menu
          id={id}
          anchorEl={anchor}
          open={open}
          onClose={onClose}
          MenuListProps={{
            subheader: (
              <ListSubheader>
                {t('bottle.dialog.available_values')}
              </ListSubheader>
            ),
          }}
        >
          {suggestions.map((suggestion, i) => (
            <MenuItem
              key={i}
              onClick={handleChange(suggestion.value)}
              disabled={null === suggestion.value}
              selected={suggestion.value === value}
              style={name === 'image' ? {height: 'auto'} : {}}
            >
              <ListItemIcon>
                <Badge badgeContent={suggestion.count} color="primary">
                  <BottleIcon />
                </Badge>
              </ListItemIcon>
              {null === suggestion.value ? (
                t('bottle.dialog.no_value')
              ) : (
                <FieldRenderer
                  value={suggestion.value}
                  name={name}
                  namespace="bottle"
                  style={name === 'image' ? {maxHeight: '5em'} : {}}
                />
              )}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={handleRemove}>
            <ListItemIcon>
              <ClearIcon />
            </ListItemIcon>
            {t('label.remove')}
          </MenuItem>
        </Menu>
      </Grid>
    </Grid>
  )
}

export default observer(BottleDialog)
