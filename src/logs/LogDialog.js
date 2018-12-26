import React from 'react'
import {observer} from 'mobx-react-lite'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import LogForm from './LogForm'

import logs from '../stores/logs'
import bottles from '../stores/bottles'
import firebase from '../api/firebase'

export default function LogDialog({log, create, onClose}) {
  const open = Boolean(log)

  const handleSave = async event => {
    event.preventDefault()
    event.stopPropagation()

    try {
      const $ref = await logs.save(log)

      const data = {
        status: log.status,
        logs: firebase.firestore.FieldValue.arrayUnion($ref),
      }

      if (log.cellar) {
        data.cellar = log.cellar
      }

      await bottles.update(log.bottles, data)

      onClose(event)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <LogDialogContent
        log={log}
        create={create}
        onSave={handleSave}
        onCancel={onClose}
      />
    </Dialog>
  )
}

const LogDialogContent = observer(function({log, create, onSave, onCancel}) {
  if (null === log) {
    return null
  }

  return (
    <form onSubmit={onSave} noValidate autoComplete="off">
      <DialogTitle id="form-dialog-title">
        {create
          ? 'New history entry'
          : `${log.status} ${log.bottles.length} bottles`}
      </DialogTitle>
      <DialogContent>
        <LogForm
          log={log}
          statuses={create ? ['bought', 'received'] : undefined}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" color="primary">
          Save
        </Button>
      </DialogActions>
    </form>
  )
})
