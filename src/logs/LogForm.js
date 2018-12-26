import React from 'react'
import {observer} from 'mobx-react-lite'
import {makeStyles} from '@material-ui/styles'
import InputAdornment from '@material-ui/core/InputAdornment'

import FieldRow from '../form/FieldRow'
import TextField from '../form/TextField'
import AutocompleteField from '../form/AutocompleteField'
import AutocompleteSuggestions from '../form/AutocompleteSuggestions'
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

  const handleChange = (value, name) => {
    log[name] = value
  }

  const statusDef = statusesDef.find(status => status.name === log.status)
  const fields = {
    when: (
      <DateField
        key="when"
        label="When"
        name="when"
        value={log.when}
        onChange={handleChange}
        className={classes.md}
      />
    ),
    where: (
      <AutocompleteField
        key="where"
        label="Where"
        name="where"
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
        children={props => (
          <AutocompleteSuggestions namespace="where" {...props} />
        )}
      />
    ),
    who: (
      <AutocompleteField
        key="who"
        label="Who"
        name="who"
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
        children={props => (
          <AutocompleteSuggestions namespace="who" {...props} />
        )}
      />
    ),
    value: (
      <TextField
        key="value"
        label="Value"
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
      <TextField
        key="rate"
        label="Rate"
        name="rate"
        value={log.rate}
        onChange={handleChange}
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
        label="Cellar"
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
        label="Why"
        name="why"
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
        children={props => (
          <AutocompleteSuggestions namespace="why" {...props} />
        )}
      />
    ),
    comment: (
      <TextField
        key="comment"
        label="Comment"
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
          label="Status"
          name="status"
          value={log.status}
          required={true}
          onChange={handleChange}
          options={statuses.map(status => ({
            value: status,
            label: status.toUpperCase(),
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
