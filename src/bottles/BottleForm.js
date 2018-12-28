import React, {useState} from 'react'
import {observer, useObservable} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next/hooks'
import {format} from 'date-fns'
import {navigate} from '@reach/router'
import SwipeableViews from 'react-swipeable-views'
import {makeStyles, useTheme} from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

import Container from '../ui/Container'
import FieldRow from '../form/FieldRow'
import DateField from '../form/DateFieldPicker'
import SelectField from '../form/SelectField'
import TextField from '../form/TextField'
import AutocompleteField from '../form/AutocompleteField'
import LogDialog from '../logs/LogDialog'
import BottleMenu from './BottleMenu'
import {SaveIcon} from '../ui/Icons'

import bottlesStore, {useBottle} from '../stores/bottles'
import logsStore, {useLog} from '../stores/logs'
import {useCellar} from '../stores/cellars'
import sorts from '../enums/sorts'
import sizes from '../enums/sizes'
import colors from '../enums/colors'
import capsules from '../enums/capsules'
import effervescences from '../enums/effervescences'

export default observer(function BottleForm({id}) {
  const [bottle, ready] = useBottle(id)

  if (!ready) {
    return 'loading'
  }

  const handleSave = () => {
    bottlesStore.save(bottle)
  }

  return <Form bottle={bottle} onSave={handleSave} />
})

const useStyles = makeStyles(theme => ({
  xs: {
    flexBasis: '50px',
    flexGrow: '1',
  },
  sm: {
    flexBasis: '75px',
    flexGrow: '1',
  },
  md: {
    flexBasis: '150px',
    flexGrow: '1',
  },
  lg: {
    flexBasis: '250px',
    flexGrow: '1',
  },
  xl: {
    width: '100%',
  },
}))

const Form = observer(function({bottle, onSave}) {
  const errors = {}
  const [tab, setTab] = useState(0)
  const [log, setLog] = useState(null)
  const form = useObservable({
    quantity: 1,
  })

  const classes = useStyles()
  const theme = useTheme()
  const [t] = useTranslation()

  const handleChange = (value, name) => {
    bottle[name] = value
  }

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      // Create $quantity bottles and add them initial log
      const promises = Array.from({length: form.quantity}, () =>
        bottlesStore.save(bottle)
      )

      const $refs = await Promise.all(promises)
      if (bottle.logs.length === 0) {
        const log = logsStore.createFrom({
          status: 'bought',
          bottles: $refs,
        })

        setLog(log)
      } else {
        navigate('/bottles')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCloseLog = event => {
    setLog(null)
    navigate('/bottles')
  }

  const sortDef = sorts.find(sort => sort.name === bottle.sort)
  const edit = Boolean(bottle.$ref)

  return (
    <>
      <LogDialog create log={log} onClose={handleCloseLog} />
      <Container
        size="sm"
        title={t(bottle.$ref ? 'bottle.form.edit' : 'bottle.form.new')}
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
            {edit ? <BottleMenu bottles={[bottle]} /> : null}
          </>
        }
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
      >
        {edit ? (
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
        ) : null}
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tab}
          onChangeIndex={setTab}
        >
          <>
            <FieldRow>
              {!edit ? (
                <TextField
                  label={t('bottle.form.quantity')}
                  required={true}
                  type="number"
                  value={form.quantity}
                  onChange={value => (form.quantity = value)}
                  className={classes.sm}
                />
              ) : null}
              <SelectField
                label={t('bottle.sort')}
                name="sort"
                value={bottle.sort}
                required={true}
                onChange={handleChange}
                //error={null !== errors.sort}
                helperText={errors.sort}
                options={sorts.map(sort => ({
                  value: sort.name,
                  label: t(`enum.sort.${sort.name}`),
                }))}
                className={classes.sm}
              />
            </FieldRow>
            <FieldRow>
              <AutocompleteField
                label={t('bottle.appellation')}
                name="appellation"
                required={true}
                value={bottle.appellation}
                onChange={handleChange}
                //error={null !== errors.appellation}
                helperText={errors.appellation}
                className={classes.lg}
                namespace="appellation"
              />
              <AutocompleteField
                label={t('bottle.cuvee')}
                name="cuvee"
                value={bottle.cuvee}
                onChange={handleChange}
                className={classes.md}
                namespace="cuvee"
              />
              {sortDef && sortDef.vintage ? (
                <TextField
                  label={t('bottle.vintage')}
                  name="vintage"
                  type="number"
                  inputProps={{pattern: '[0-9]{4}'}}
                  value={bottle.vintage}
                  onChange={handleChange}
                  className={classes.xs}
                />
              ) : null}
              {sortDef && sortDef.bottlingDate ? (
                <DateField
                  label={t('bottle.bottlingDate')}
                  name="bottlingDate"
                  value={bottle.bottlingDate}
                  onChange={handleChange}
                  className={classes.sm}
                />
              ) : null}
              {sortDef && sortDef.expirationDate ? (
                <DateField
                  label={t('bottle.expirationDate')}
                  name="expirationDate"
                  value={bottle.expirationDate}
                  onChange={handleChange}
                  className={classes.sm}
                />
              ) : null}
            </FieldRow>
            <FieldRow>
              <AutocompleteField
                label={t('bottle.producer')}
                name="producer"
                value={bottle.producer}
                onChange={handleChange}
                className={classes.md}
                namespace="producer"
              />
              <AutocompleteField
                label={t('bottle.region')}
                name="region"
                value={bottle.region}
                onChange={handleChange}
                className={classes.md}
                namespace="region"
              />
              <AutocompleteField
                label={t('bottle.country')}
                name="country"
                value={bottle.country}
                onChange={handleChange}
                className={classes.md}
                namespace="country"
              />
            </FieldRow>
            <FieldRow>
              <SelectField
                label={t('bottle.size')}
                name="size"
                value={bottle.size}
                onChange={handleChange}
                empty={<em>{t('form.select.empty')}</em>}
                options={sizes.map(size => ({
                  value: size,
                  label: t(`enum.size.${size}`),
                }))}
                className={classes.md}
              />
              <SelectField
                label={t('bottle.color')}
                name="color"
                value={bottle.color}
                onChange={handleChange}
                empty={<em>{t('form.select.empty')}</em>}
                options={colors.map(color => ({
                  value: color,
                  label: t(`enum.color.${color}`),
                }))}
                className={classes.md}
              />
              <SelectField
                label={t('bottle.effervescence')}
                name="effervescence"
                value={bottle.effervescence}
                onChange={handleChange}
                empty={<em>{t('form.select.empty')}</em>}
                options={effervescences.map(effervescence => ({
                  value: effervescence,
                  label: t(`enum.effervescence.${effervescence}`),
                }))}
                className={classes.md}
              />
              {sortDef ? (
                <SelectField
                  label={t('bottle.type')}
                  name="type"
                  value={bottle.type}
                  onChange={handleChange}
                  empty={<em>{t('form.select.empty')}</em>}
                  options={sortDef.types.map(type => ({
                    value: type,
                    label: t(`enum.type.${type}`),
                  }))}
                  className={classes.md}
                />
              ) : null}
            </FieldRow>
            <FieldRow>
              <SelectField
                label={t('bottle.capsule')}
                name="capsule"
                value={bottle.capsule}
                onChange={handleChange}
                empty={<em>{t('form.select.empty')}</em>}
                options={capsules.map(capsule => ({
                  value: capsule,
                  label: t(`enum.capsule.${capsule}`),
                }))}
                className={classes.sm}
              />
              <TextField
                type="number"
                label={t('bottle.alcohol')}
                name="alcohol"
                value={bottle.alcohol}
                onChange={handleChange}
                className={classes.sm}
              />
              <TextField
                label={t('bottle.medal')}
                name="medal"
                value={bottle.medal}
                onChange={handleChange}
                className={classes.md}
              />
            </FieldRow>
          </>
          <>
            {edit ? (
              bottle.logs && bottle.logs.length ? (
                <List>
                  <Divider />
                  {bottle.logs.map($ref => (
                    <LogItem key={$ref.id} id={$ref.id} />
                  ))}
                </List>
              ) : (
                <Typography>{t('bottle.form.no_log')}</Typography>
              )
            ) : null}
          </>
        </SwipeableViews>
      </Container>
    </>
  )
})

const LogItem = observer(function({id}) {
  const [log, ready] = useLog(id)

  if (!ready) {
    return null
  }

  return (
    <>
      <ListItem>
        <ListItemText
          primary={<LogRenderer log={log} />}
          secondary={log.comment}
        />
      </ListItem>
      <Divider />
    </>
  )
})

function LogRenderer({log}) {
  const [t] = useTranslation()
  const [cellar] = useCellar(log.cellar)

  const values = {
    status: log.status ? t('log.print.status', {status: log.status}) : '',
    when: log.when ? t('log.print.when', {when: format(log.when, 'P')}) : '',
    where: log.where ? t('log.print.where', {where: log.where}) : '',
    who: log.who ? t('log.print.who', {who: log.who}) : '',
    why: log.why ? t('log.print.why', {why: log.why}) : '',
    value: log.value ? t('log.print.value', {value: log.value}) : '',
    rate: log.rate ? t('log.print.rate', {rate: log.rate}) : '',
    cellar:
      log.cellar && cellar ? t('log.print.cellar', {cellar: cellar.name}) : '',
  }

  return t('log.print.full', values)
}
