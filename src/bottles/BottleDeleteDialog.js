import React from 'react';
import {observer, useObservable} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import logsStore from '../stores/logsStore';
import bottlesStore from '../stores/bottlesStore';
import uiStore from '../stores/ui';

function BottleDeleteDialog() {
  const [t] = useTranslation();
  const state = useObservable(uiStore.bottleDeleteDialog);
  const {bottles} = state;
  const open = bottles.length > 0;

  function handleClose() {
    state.bottles = [];
  }

  async function handleDelete() {
    const bottleRefs = bottles.map(bottle => bottle.$ref);

    const logPromises = bottles.map(async bottle => {
      // Remove logs if only one bottle remaining (meaning this bottle)
      const snapshot = await logsStore.getByBottle(bottle.$ref);
      const logRefs = snapshot.docs
        .filter(doc => doc.data().bottles.length === 1)
        .map(doc => doc.ref);

      return logsStore.delete(logRefs);
    });

    await Promise.all(logPromises);
    await bottlesStore.delete(bottleRefs);

    handleClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-dialog-title"
    >
      <DialogTitle id="delete-dialog-title">
        {t('bottle.menu.delete_dialog', {count: bottles.length})}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>{t('label.cancel')}</Button>
        <Button onClick={handleDelete} color="primary" autoFocus>
          {t('label.yes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default observer(BottleDeleteDialog);
