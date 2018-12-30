import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next/hooks'
import {makeStyles} from '@material-ui/styles'
import InputAdornment from '@material-ui/core/InputAdornment'

import FieldRow from '../form/FieldRow'
import TextField from '../form/TextField'
import AutocompleteField from '../form/AutocompleteField'
import DateField from '../form/DateFieldPicker'
import CellarField from '../form/CellarField'
import SelectField from '../form/SelectField'
import {
  StatusIcon,
  WhereIcon,
  WhoIcon,
  ValueIcon,
  RateIcon,
  CellarIcon,
  WhyIcon,
  CommentIcon,
} from '../ui/Icons'

import ratings from '../enums/ratings'
import statusesDef from '../enums/statuses'

const useStyles = makeStyles(theme => ({
  sm: {
    flexBasis: '75px',
    flexGrow: '1',
  },
  md: {
    flexBasis: '200px',
    flexGrow: '1',
  },
  xl: {
    width: '100%',
  },
}))

export default observer(function LogForm({log, statuses, onSave}) {
  const errors = {}
  const classes = useStyles()
  const [t] = useTranslation()

  const handleChange = (value, name) => {
    log[name] = value
  }

  const statusDef = statusesDef.find(status => status.name === log.status)
  const fields = {
    when: (
      <DateField
        key="when"
        label={t('log.when')}
        name="when"
        value={log.when}
        onChange={handleChange}
        className={classes.md}
      />
    ),
    where: (
      <AutocompleteField
        key="where"
        label={t('log.where')}
        name="where"
        namespace="where"
        value={log.where}
        onChange={handleChange}
        className={classes.md}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <WhereIcon />
            </InputAdornment>
          ),
        }}
      />
    ),
    who: (
      <AutocompleteField
        key="who"
        label={t('log.who')}
        name="who"
        namespace="who"
        value={log.who}
        onChange={handleChange}
        className={classes.md}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <WhoIcon />
            </InputAdornment>
          ),
        }}
      />
    ),
    value: (
      <TextField
        key="value"
        label={t('log.value')}
        name="value"
        value={log.value}
        onChange={handleChange}
        className={classes.sm}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ValueIcon />
            </InputAdornment>
          ),
        }}
      />
    ),
    rate: (
      <SelectField
        key="rate"
        label={t('log.rate')}
        name="rate"
        value={log.rate}
        onChange={handleChange}
        empty={<em>None</em>}
        options={ratings.map(rating => ({
          value: rating,
          label: rating,
        }))}
        className={classes.sm}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <RateIcon />
            </InputAdornment>
          ),
        }}
      />
    ),
    cellar: (
      <CellarField
        key="cellar"
        label={t('log.cellar')}
        name="cellar"
        value={log.cellar}
        required={true}
        onChange={handleChange}
        className={classes.md}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CellarIcon />
            </InputAdornment>
          ),
        }}
      />
    ),
    why: (
      <AutocompleteField
        key="why"
        label={t('log.why')}
        name="why"
        namespace="why"
        value={log.why}
        onChange={handleChange}
        className={classes.md}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <WhyIcon />
            </InputAdornment>
          ),
        }}
      />
    ),
    comment: (
      <TextField
        key="comment"
        label={t('log.comment')}
        name="comment"
        value={log.comment}
        onChange={handleChange}
        className={classes.xl}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CommentIcon />
            </InputAdornment>
          ),
        }}
      />
    ),
  }

  return (
    <FieldRow>
      {statuses ? (
        <SelectField
          label={t('log.status')}
          name="status"
          value={log.status}
          required={true}
          onChange={handleChange}
          options={statuses.map(status => ({
            value: status,
            label: t(`enum.status.${status}`),
          }))}
          className={classes.sm}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <StatusIcon />
              </InputAdornment>
            ),
          }}
        />
      ) : null}
      {statusDef ? statusDef.fields.map(field => fields[field]) : null}
    </FieldRow>
  )
})
