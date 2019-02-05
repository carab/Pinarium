import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import {Trans} from 'react-i18next/hooks';
import {navigate} from '@reach/router';
import {makeStyles} from '@material-ui/styles';
import {IconButton} from '@material-ui/core';

import Container from '../ui/Container';
import ProgressButton from '../ui/ProgressButton';
import {SaveIcon} from '../ui/Icons';
import FieldRow from '../form/FieldRow';
import TextField from '../form/TextField';
import cellarsStore, {useCellar} from '../stores/cellarsStore';

export default observer(function CellarForm({id}) {
  const [cellar, ready] = useCellar(id);

  if (!ready) {
    return null;
  }

  const handleSave = () => {
    cellarsStore.save(cellar);
  };

  return (
    <Form
      title={<Trans i18nKey={id ? 'cellar.form.edit' : 'cellar.form.new'} />}
      cellar={cellar}
      onSave={handleSave}
    />
  );
});

const useStyles = makeStyles(theme => ({
  name: {
    flexBasis: '200px',
  },
  description: {
    width: '100%',
  },
}));

const Form = observer(function({title, cellar, onSave}) {
  const [saving, setSaving] = useState(false);
  const errors = {};

  const classes = useStyles();
  const [t] = useTranslation();

  function handleChange(value, name) {
    cellar[name] = value;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await onSave();
      setTimeout(() => {
        // Time illusion for feedback
        setSaving(false);
      }, 500);
    } catch (error) {
      setSaving(false);
      console.error(error);
    }
  }

  return (
    <Container
      size="sm"
      title={title}
      actions={
        <ProgressButton
          Component={IconButton}
          loading={saving}
          size={40}
          type="submit"
          color="inherit"
          title={t('label.save')}
          aria-label={t('label.save')}
          onClick={handleSubmit}
        >
          <SaveIcon />
        </ProgressButton>
      }
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
    >
      <FieldRow>
        <TextField
          label={<Trans i18nKey="cellar.name" />}
          name="name"
          required={true}
          value={cellar.name}
          onChange={handleChange}
          //error={null !== errors.name}
          helperText={errors.name}
          className={classes.name}
        />
      </FieldRow>
      <FieldRow>
        <TextField
          label={<Trans i18nKey="cellar.description" />}
          name="description"
          value={cellar.description}
          onChange={handleChange}
          className={classes.description}
        />
      </FieldRow>
    </Container>
  );
});
