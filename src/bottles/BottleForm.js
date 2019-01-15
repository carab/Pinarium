import React, {useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next/hooks'
import {navigate} from '@reach/router'
import SwipeableViews from 'react-swipeable-views'
import {useTheme} from '@material-ui/styles'
import IconButton from '@material-ui/core/IconButton'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider'

import Container from '../ui/Container'
import TextField from '../form/TextField'
import LogDialog from '../logs/LogDialog'
import BottleMenu from './BottleMenu'
import EtiquetteForm from './EtiquetteForm'
import {SaveIcon, EditIcon, DeleteIcon} from '../ui/Icons'

import {format} from '../lib/date'
import bottlesStore, {useBottle} from '../stores/bottlesStore'
import logsStore, {useBottleLogs} from '../stores/logsStore'
import autocompletesStore from '../stores/autocompletesStore'
import {useCellar} from '../stores/cellarsStore'
import {useUser} from '../stores/userStore'
import useLocale from '../hooks/useLocale'

export default observer(function BottleForm({id}) {
  const [bottle, ready] = useBottle(id)

  if (!ready) {
    return null
  }

  function handleSave() {
    bottlesStore.save(bottle)
  }

  return <Form bottle={bottle} onSave={handleSave} />
})

const Form = observer(function({bottle, onSave}) {
  const errors = {}
  const [user] = useUser()
  const [tab, setTab] = useState(0)
  const [log, setLog] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const edit = Boolean(bottle.$ref)

  const theme = useTheme()
  const [t] = useTranslation()

  function handleChange(value, name) {
    bottle[name] = value
  }

  function handleChangeQuantity(value) {
    setQuantity(value)
  }

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      // Preprocess data (eg. for image uploading)
      const data = await bottlesStore.preSave(bottle)

      // Create $quantity bottles and add them initial log
      const promises = Array.from({length: quantity}, () =>
        bottlesStore.save(data)
      )

      const $refs = await Promise.all(promises)

      await autocompletesStore.updateFrom(data, [
        'appellation',
        'cuvee',
        'producer',
        'region',
        'country',
      ])

      if (data.logs.length === 0) {
        const log = logsStore.createFrom({
          status: 'bought',
          bottles: $refs,
          cellar: user.defaultCellar,
        })

        setLog(log)
      } else {
        navigate('/bottles')
      }
    } catch (error) {
      console.error(error)
    }
  }

  function handleCloseLog(logRef) {
    setLog(null)
    navigate('/bottles')
  }

  return (
    <>
      <LogDialog create log={log} onClose={handleCloseLog} />
      <Container
        startAdornment={
          !edit && (
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
        title={t(edit ? 'bottle.form.edit' : 'bottle.form.new')}
        actions={
          <>
            <IconButton
              type="submit"
              color="secondary"
              title={t('label.save')}
              aria-label={t('label.save')}
            >
              <SaveIcon />
            </IconButton>
            {edit && <BottleMenu bottles={[bottle]} />}
          </>
        }
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
      >
        {edit && (
          <Tabs
            value={tab}
            onChange={(event, tab) => setTab(tab)}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
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
            bottle={bottle}
            onChange={handleChange}
          />
          <>{edit && <LogList bottle={bottle} />}</>
        </SwipeableViews>
      </Container>
    </>
  )
})

const LogList = observer(function({bottle}) {
  const [t] = useTranslation()
  const [logs, ready] = useBottleLogs(bottle.$ref)

  if (!ready) {
    return null
  }

  async function handleDelete(log) {
    // Delete or update log depending on if it's the last bottle
    if (log.bottles.length <= 1) {
      await logsStore.delete([log.$ref])
    } else {
      await logsStore.removeBottles([log.$ref], [bottle.$ref])
    }

    await bottlesStore.removeLogs([bottle.$ref], [log.$ref])
    await bottlesStore.updateFromLogs([bottle.$ref])
  }

  const [log, setLog] = useState(null)
  function handleEdit(log) {
    setLog(log)
  }

  function handleSave(logRef) {
    setLog(null)
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
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <ListItem>
            <ListItemText primary={t('bottle.form.no_log')} />
          </ListItem>
        )}
      </List>
      <LogDialog log={log} onClose={handleSave} />
    </>
  )
})

const LogItem = observer(function({log, onEdit, onDelete}) {
  const [t] = useTranslation()

  return (
    <>
      <ListItem>
        <ListItemText
          primary={<LogRenderer log={log} />}
          secondary={log.comment}
        />
        <ListItemSecondaryAction>
          <IconButton
            size="small"
            aria-label={t('label.edit')}
            title={t('label.edit')}
            onClick={() => onEdit(log)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            aria-label={t('label.delete')}
            title={t('label.delete')}
            onClick={() => onDelete(log)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  )
})

export const LogRenderer = observer(function({log}) {
  const [t] = useTranslation()
  const [locale] = useLocale()
  const [cellar] = useCellar(log.cellar)

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
  }

  return t('log.print.full', values)
})
