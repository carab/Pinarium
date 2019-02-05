import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';

import ProgressButton from '../ui/ProgressButton';

import logsStore from '../stores/logsStore';
import bottlesStore from '../stores/bottlesStore';

const DEFAULT_REMOVE = true;

function LogDeleteDialog({log, bottle, onClose}) {
  const [t] = useTranslation();
  const [remove, setRemove] = useState(DEFAULT_REMOVE);
  const [saving, setSaving] = useState(false);
  const canRemove = bottle && log && log.bottles.length > 1;
  const open = Boolean(log);

  function handleClose() {
    setRemove(DEFAULT_REMOVE);

    if (onClose instanceof Function) {
      onClose();
    }
  }

  async function handleSubmit() {
    let bottleRefs = log.bottles;

    setSaving(true);

    try {
      if (canRemove && remove) {
        bottleRefs = [bottle.$ref];
        await logsStore.removeBottles([log.$ref], bottleRefs); // Remove the bottles from it
      } else {
        await logsStore.delete([log.$ref]); // Permanently delete it
      }

      await bottlesStore.removeLogs(bottleRefs, [log.$ref]); // Remove it from its bottles
      await bottlesStore.applyLogs(bottleRefs); // Apply logs on its bottles

      setSaving(false);
      handleClose();
    } catch (error) {
      console.error(error);
      setSaving(false);
    }
  }

  function handleChange(event) {
    setRemove(event.target.value === '1');
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-log-delete-title"
    >
      <DialogTitle id="dialog-log-delete-title">
        {t('log.form.delete')}
      </DialogTitle>
      <DialogContent>
        {canRemove ? (
          <FormControl>
            <RadioGroup
              aria-label={t('label.remove')}
              name="remove"
              value={remove ? '1' : '0'}
              onChange={handleChange}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label={t('log.form.remove_only')}
              />
              <FormControlLabel
                value="0"
                control={<Radio />}
                label={t('log.form.delete_all')}
              />
            </RadioGroup>
          </FormControl>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('label.cancel')}</Button>
        <ProgressButton
          loading={saving}
          onClick={handleSubmit}
          color="primary"
          autoFocus
        >
          {canRemove && remove ? t('label.remove') : t('label.delete')}
        </ProgressButton>
      </DialogActions>
    </Dialog>
  );
}

export default observer(LogDeleteDialog);
