import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import SwipeableViews from 'react-swipeable-views';
import {useTheme, makeStyles} from '@material-ui/styles';
import {
  Tabs,
  Tab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  CircularProgress,
} from '@material-ui/core';

import Container from '../ui/Container';
import ProgressButton from '../ui/ProgressButton';
import TextField from '../form/TextField';
import LogEditDialog from '../logs/LogEditDialog';
import LogDeleteDialog from '../logs/LogDeleteDialog';
import BottleMenu from './BottleMenu';
import EtiquetteForm from './EtiquetteForm';
import {MoreIcon, SaveIcon, EditIcon, DeleteIcon} from '../ui/Icons';

import {format} from '../lib/date';
import bottlesStore, {useBottle} from '../stores/bottlesStore';
import logsStore, {useBottleLogs} from '../stores/logsStore';
import autocompletesStore from '../stores/autocompletesStore';
import dialogStore from '../stores/dialogStore';
import {useCellar} from '../stores/cellarsStore';
import {useUser} from '../stores/userStore';
import useLocale from '../hooks/useLocale';
import useAnchor from '../hooks/useAnchor';

export default observer(function BottleForm({id}) {
  const [bottle, ready] = useBottle(id);

  if (!ready) {
    return null;
  }

  return <Form bottle={bottle} />;
});

const Form = observer(function({bottle}) {
  const errors = {};
  const editing = Boolean(bottle.$ref);
  const [user] = useUser();
  const [tab, setTab] = useState(0);
  const [log, setLog] = useState(null);
  const [saving, setSaving] = useState(false);
  const [quantity, setQuantity] = useState(editing ? 1 : 1);

  const theme = useTheme();
  const [t] = useTranslation();

  function handleChange(value, name) {
    bottle[name] = value;
  }

  function handleChangeQuantity(value) {
    setQuantity(value);
  }

  const handleSubmit = async event => {
    event.preventDefault();
    setSaving(true);

    try {
      // Preprocess data (eg. for etiquette uploading)
      const data = await bottlesStore.preSave(bottle);

      // Create $quantity bottles and add them initial log
      const promises = Array.from({length: quantity}, () =>
        bottlesStore.save(data)
      );

      const $refs = await Promise.all(promises);

      await autocompletesStore.updateFrom(data, [
        'appellation',
        'cuvee',
        'producer',
        'region',
        'country',
        'etiquette',
      ]);

      setSaving(false);

      if (data.logs.length === 0) {
        const log = logsStore.createFrom({
          status: 'bought',
          bottles: $refs,
          cellar: user.defaultCellar,
        });

        setLog(log);
      } else {
        // navigate('/bottles');
        console.log('saved');
      }
    } catch (error) {
      setSaving(false);
      console.error(error);
    }
  };

  function handleCloseLog(logRef) {
    setLog(null);
    // navigate('/bottles');
  }

  return (
    <>
      <LogEditDialog create log={log} onClose={handleCloseLog} />
      <Container
        startAdornment={
          !editing && (
            <TextField
              label={t('bottle.form.quantity')}
              required={true}
              type="number"
              value={quantity}
              onChange={handleChangeQuantity}
            />
          )
        }
        size="sm"
        title={t(editing ? 'bottle.form.edit' : 'bottle.form.new')}
        actions={
          <>
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
            {editing && <BottleMenu bottles={[bottle]} />}
          </>
        }
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
      >
        {editing && (
          <Tabs
            value={tab}
            onChange={(event, tab) => setTab(tab)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label={t('bottle.form.tab_etiquette')} />
            <Tab label={t('bottle.form.tab_history')} />
          </Tabs>
        )}
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tab}
          onChangeIndex={setTab}
        >
          <EtiquetteForm
            errors={errors}
            editing={editing}
            bottle={bottle}
            onChange={handleChange}
          />
          <>{editing && <LogList bottle={bottle} />}</>
        </SwipeableViews>
      </Container>
    </>
  );
});

const useLogListStyles = makeStyles(theme => ({
  progressWrapper: {
    textAlign: 'center',
    padding: theme.spacing.unit * 6,
  },
}));

const LogList = observer(function({bottle}) {
  const [t] = useTranslation();
  const [logs, ready] = useBottleLogs(bottle.$ref);
  const classes = useLogListStyles();

  if (!ready) {
    return (
      <div className={classes.progressWrapper}>
        <CircularProgress size={48} color="primary" />
      </div>
    );
  }

  function handleOpenEdit(log) {
    dialogStore.open('log_edit', {log, bottle});
  }

  function handleCloseEdit() {
    dialogStore.close('log_edit');
  }

  function handleOpenDelete(log) {
    dialogStore.open('log_delete', {log, bottle});
  }

  function handleCloseDelete() {
    dialogStore.close('log_delete');
  }

  return (
    <>
      <List>
        <Divider />
        {logs.length ? (
          logs.map(log => (
            <LogItem
              key={log.$ref.id}
              log={log}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))
        ) : (
          <ListItem>
            <ListItemText primary={t('bottle.form.no_log')} />
          </ListItem>
        )}
      </List>
      <LogEditDialog
        {...dialogStore.props('log_edit')}
        onClose={handleCloseEdit}
      />
      <LogDeleteDialog
        {...dialogStore.props('log_delete')}
        onClose={handleCloseDelete}
      />
    </>
  );
});

const useLogStyles = makeStyles(theme => ({
  delete: {
    color: theme.palette.error.main,
  },
}));

const LogItem = observer(function({log, onEdit, onDelete}) {
  const [t] = useTranslation();
  const [anchor, open, onOpen, onClose] = useAnchor();
  const classes = useLogStyles();
  const id = `menu-log-${log.$ref}`;

  function handleEdit() {
    onClose();
    onEdit(log);
  }

  function handleDelete() {
    onClose();
    onDelete(log);
  }

  return (
    <>
      <ListItem>
        <ListItemText
          primary={<LogRenderer log={log} />}
          secondary={log.comment}
        />
        <ListItemSecondaryAction>
          <IconButton
            aria-owns={open ? id : undefined}
            aria-haspopup="true"
            onClick={onOpen}
            color="inherit"
            title={t('bottle.menu.open')}
            aria-label={t('bottle.menu.open')}
          >
            <MoreIcon />
          </IconButton>
          <Menu
            id={id}
            anchorEl={anchor}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={onClose}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              {t('label.edit')}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDelete} className={classes.delete}>
              <ListItemIcon>
                <DeleteIcon className={classes.delete} />
              </ListItemIcon>
              {t('label.delete')}
            </MenuItem>
          </Menu>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  );
});

export const LogRenderer = observer(function({log}) {
  const [t] = useTranslation();
  const [locale] = useLocale();
  const [cellar] = useCellar(log.cellar);

  const values = {
    status: log.status ? t('log.print.status', {status: log.status}) : '',
    when: log.when
      ? t('log.print.when', {
          when: format(log.when, 'P', locale),
        })
      : '',
    where: log.where ? t('log.print.where', {where: log.where}) : '',
    who: log.who ? t('log.print.who', {who: log.who}) : '',
    why: log.why ? t('log.print.why', {why: log.why}) : '',
    price: log.price ? t('log.print.price', {price: log.price}) : '',
    rating: log.rating ? t('log.print.rating', {rating: log.rating}) : '',
    cellar:
      log.cellar && cellar ? t('log.print.cellar', {cellar: cellar.name}) : '',
  };

  return t('log.print.full', values);
});
