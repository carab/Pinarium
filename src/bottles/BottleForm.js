import React, {useState} from 'react'
import {observer, useObservable} from 'mobx-react-lite'
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
import {useUser} from '../stores/userStore'
import sorts from '../enums/sorts'
import sizes from '../enums/sizes'
import colors from '../enums/colors'
import capsules from '../enums/capsules'
import effervescences from '../enums/effervescences'

export default observer(function BottleForm({id}) {
  const bottle = useBottle(id)

  if (null === bottle) {
    return 'loading'
  }

  const handleSave = () => {
    bottlesStore.save(bottle)
  }

  return (
    <Form title={id ? 'Edit' : 'New'} bottle={bottle} onSave={handleSave} />
  )
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

const Form = observer(function({title, bottle, onSave}) {
  const user = useUser()

  const errors = {}
  const [tab, setTab] = useState(0)
  const [log, setLog] = useState(null)
  const form = useObservable({
    quantity: 1,
  })

  const classes = useStyles()
  const theme = useTheme()

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
        const log = logsStore.createFrom(
          {
            status: 'bought',
            bottles: $refs,
          },
          user
        )

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
        title={title}
        actions={
          <>
            <IconButton type="submit" color="secondary" title="Save">
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
            <Tab label="Etiquette" />
            <Tab label="History" />
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
                  label="Quantity"
                  required={true}
                  type="number"
                  value={form.quantity}
                  onChange={value => (form.quantity = value)}
                  className={classes.sm}
                />
              ) : null}
              <SelectField
                label="Sort"
                name="sort"
                value={bottle.sort}
                required={true}
                onChange={handleChange}
                //error={null !== errors.sort}
                helperText={errors.sort}
                options={sorts.map(sort => ({
                  value: sort.name,
                  label: sort.name.toUpperCase(),
                }))}
                className={classes.sm}
              />
            </FieldRow>
            <FieldRow>
              <AutocompleteField
                label="Appellation"
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
                label="Cuvée"
                name="cuvee"
                value={bottle.cuvee}
                onChange={handleChange}
                className={classes.md}
                namespace="cuvee"
              />
              {sortDef && sortDef.vintage ? (
                <TextField
                  label="Vintage"
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
                  label="Bottling date"
                  name="bottlingDate"
                  value={bottle.bottlingDate}
                  onChange={handleChange}
                  className={classes.sm}
                />
              ) : null}
              {sortDef && sortDef.expirationDate ? (
                <DateField
                  label="Expiration date"
                  name="expirationDate"
                  value={bottle.expirationDate}
                  onChange={handleChange}
                  className={classes.sm}
                />
              ) : null}
            </FieldRow>
            <FieldRow>
              <AutocompleteField
                label="Producer"
                name="producer"
                value={bottle.producer}
                onChange={handleChange}
                className={classes.md}
                namespace="producer"
              />
              <AutocompleteField
                label="Region"
                name="region"
                value={bottle.region}
                onChange={handleChange}
                className={classes.md}
                namespace="region"
              />
              <AutocompleteField
                label="Country"
                name="country"
                value={bottle.country}
                onChange={handleChange}
                className={classes.md}
                namespace="country"
              />
            </FieldRow>
            <FieldRow>
              <SelectField
                label="Size"
                name="size"
                value={bottle.size}
                onChange={handleChange}
                empty={<em>None</em>}
                options={sizes.map(size => ({
                  value: size,
                  label: size,
                }))}
                className={classes.md}
              />
              <SelectField
                label="Color"
                name="color"
                value={bottle.color}
                onChange={handleChange}
                empty={<em>None</em>}
                options={colors.map(color => ({
                  value: color,
                  label: color.toUpperCase(),
                }))}
                className={classes.md}
              />
              <SelectField
                label="Effervescence"
                name="effervescence"
                value={bottle.effervescence}
                onChange={handleChange}
                empty={<em>None</em>}
                options={effervescences.map(effervescence => ({
                  value: effervescence,
                  label: effervescence.toUpperCase(),
                }))}
                className={classes.md}
              />
              {sortDef ? (
                <SelectField
                  label="Type"
                  name="type"
                  value={bottle.type}
                  onChange={handleChange}
                  empty={<em>None</em>}
                  options={sortDef.types.map(type => ({
                    value: type,
                    label: type.toUpperCase(),
                  }))}
                  className={classes.md}
                />
              ) : null}
            </FieldRow>
            <FieldRow>
              <SelectField
                label="Capsule"
                name="capsule"
                value={bottle.capsule}
                onChange={handleChange}
                empty={<em>None</em>}
                options={capsules.map(capsule => ({
                  value: capsule,
                  label: capsule.toUpperCase(),
                }))}
                className={classes.sm}
              />
              <TextField
                type="number"
                label="Alcohol"
                name="alcohol"
                value={bottle.alcohol}
                onChange={handleChange}
                className={classes.sm}
              />
              <TextField
                label="Medal/Prize"
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
                  {bottle.logs.map($ref => (
                    <LogItem key={$ref.id} id={$ref.id} />
                  ))}
                </List>
              ) : (
                <Typography>No entry for now</Typography>
              )
            ) : null}
          </>
        </SwipeableViews>
      </Container>
    </>
  )
})

const LogItem = observer(function({id}) {
  const log = useLog(id)

  if (log) {
    return (
      <ListItem>
        <ListItemText primary={printLog(log)} secondary={log.comment} />
      </ListItem>
    )
  }
})

function printLog(log) {
  const value = [
    log.status,
    log.when,
    log.where,
    log.who,
    log.why,
    log.value,
    log.rate,
    log.cellar,
  ].filter(field => null !== field && null !== undefined)

  return value.join(', ')
}
