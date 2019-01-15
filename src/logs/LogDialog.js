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
import autocompletesStore from '../stores/autocompletesStore'
import logsStore from '../stores/logsStore'
import bottlesStore from '../stores/bottlesStore';

export default function LogDialog({log, create, onClose}) {
  const open = Boolean(log)

  async function handleSave(event) {
    event.preventDefault()
    event.stopPropagation()

    try {
      const logRef = await logsStore.save(log)

      // Update autocompletes
      await autocompletesStore.updateFrom(log, ['where', 'who', 'why'])

      // Update bottles
      await bottlesStore.addLogs(log.bottles, [logRef])
      await bottlesStore.updateFromLogs(log.bottles)

      onClose(logRef)
    } catch (error) {
      console.error(error)
    }
  }

  function handleCancel(event) {
    onClose(null)
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="log-dialog-title"
    >
      <LogDialogContent
        log={log}
        create={create}
        onSave={handleSave}
        onCancel={handleCancel}
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
        <Button type="submit" color="primary">
          <Trans i18nKey="label.save" />
        </Button>
      </DialogActions>
    </form>
  )
})
