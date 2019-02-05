import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import LogForm from './LogForm';
import ProgressButton from '../ui/ProgressButton';

import {defaultStatuses} from '../enums/statuses';
import autocompletesStore from '../stores/autocompletesStore';
import logsStore from '../stores/logsStore';
import bottlesStore from '../stores/bottlesStore';

export default function LogEditDialog({log, create, onClose}) {
  const [saving, setSaving] = useState(false);
  const open = Boolean(log);

  async function handleSave(event) {
    event.preventDefault();
    event.stopPropagation();

    setSaving(true);

    try {
      const logRef = await logsStore.save(log);

      // Update autocompletes
      await autocompletesStore.updateFrom(log, ['where', 'who', 'why']);

      // Update bottles
      await bottlesStore.addLogs(log.bottles, [logRef]);
      await bottlesStore.applyLogs(log.bottles);

      onClose(logRef);
      setSaving(false);
    } catch (error) {
      console.error(error);
      setSaving(false);
    }
  }

  function handleCancel(event) {
    onClose(null);
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
      aria-labelledby="dialog-log-edit-title"
    >
      <LogEditDialogContent
        log={log}
        create={create}
        saving={saving}
        onCancel={handleCancel}
      />
    </Dialog>
  );
}

const LogEditDialogContent = observer(function({
  log,
  create,
  saving,
  onCancel,
}) {
  const [t] = useTranslation();

  if (!log) {
    return null;
  }

  const count = log.bottles.length;

  return (
    <>
      <DialogTitle id="dialog-log-edit-title">
        {create
          ? t('log.form.new')
          : `${t(`enum.status.${log.status}`, {count})} (${count})`}
      </DialogTitle>
      <DialogContent>
        <LogForm log={log} statuses={create ? defaultStatuses : undefined} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('label.cancel')}</Button>
        <ProgressButton loading={saving} type="submit" color="primary">
          {t('label.save')}
        </ProgressButton>
      </DialogActions>
    </>
  );
});
