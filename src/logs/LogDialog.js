import React from 'react'
import {observer} from 'mobx-react-lite'
import {Trans} from 'react-i18next/hooks'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import LogForm from './LogForm'

import {defaultStatuses} from '../enums/statuses'
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
    <Dialog open={open} onClose={onClose} aria-labelledby="log-dialog-title">
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

  const count = log.bottles.length

  return (
    <form onSubmit={onSave} noValidate autoComplete="off">
      <DialogTitle id="log-dialog-title">
        {create ? (
          <Trans i18nKey="log.form.new" />
        ) : (
          <>
            <Trans i18nKey={`enum.status.${log.status}`} count={count} />
            {` (${count})`}
          </>
        )}
      </DialogTitle>
      <DialogContent>
        <LogForm log={log} statuses={create ? defaultStatuses : undefined} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>
          <Trans i18nKey="label.cancel" />
        </Button>
        <Button type="primary" color="primary">
          <Trans i18nKey="label.save" />
        </Button>
      </DialogActions>
    </form>
  )
})
