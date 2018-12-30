import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next/hooks'
import {makeStyles} from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import TextField from '../form/TextField'
import FieldRow from '../form/FieldRow'

import searchesStore from '../stores/searchesStore'

export default function SearchDialog({search, onClose}) {
  const open = Boolean(search)

  const handleSave = async event => {
    event.preventDefault()

    try {
      await searchesStore.save(search)
      onClose(event)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="search-dialog-title">
      <SearchDialogContent
        search={search}
        onSave={handleSave}
        onCancel={onClose}
      />
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  sm: {
    flexBasis: '75px',
    flexGrow: '1',
  },
  md: {
    flexBasis: '200px',
    flexGrow: '1',
  },
  xl: {
    width: '100%',
  },
}))

const SearchDialogContent = observer(function({search, onSave, onCancel}) {
  const classes = useStyles()
  const [t] = useTranslation()

  const handleChange = (value, name) => {
    search[name] = value
  }

  if (null === search) {
    return null
  }

  return (
    <form onSubmit={onSave} noValidate autoComplete="off">
      <DialogTitle id="search-dialog-title">{t('search.form.new')}</DialogTitle>
      <DialogContent>
        <FieldRow>
          <TextField
            label={t('search.name')}
            name="name"
            value={search.name}
            onChange={handleChange}
            className={classes.md}
          />
        </FieldRow>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('label.cancel')}</Button>
        <Button type="submit" color="primary">
          {t('label.save')}
        </Button>
      </DialogActions>
    </form>
  )
})
