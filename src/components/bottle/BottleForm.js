import React, {Component} from 'react'
import formatDate from 'date-fns/format'
import {withRouter} from 'react-router-dom'
import {store, view} from 'react-easy-state'
import {withStyles} from 'material-ui/styles'
import List, {ListItem, ListItemText, ListSubheader} from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'

import SelectField from '../form/SelectField'
import TextField from '../form/TextField'
import DateField from '../form/DateField'
import FormDialog, {FormContainer, FormRow} from '../ui/FormDialog'
import {RemoveIcon} from '../ui/Icons'

import bottlesStore from '../../stores/bottlesStore'
import cellarsStore from '../../stores/cellarsStore'
import logsStore from '../../stores/logsStore'
import status from '../../stores/status'

@withRouter
@withStyles(theme => ({
  inputXS: {
    margin: theme.spacing.unit,
    flexBasis: '50px',
  },
  inputSM: {
    margin: theme.spacing.unit,
    flexBasis: '75px',
  },
  inputMD: {
    margin: theme.spacing.unit,
    flexBasis: '150px',
    flexGrow: '1',
  },
  inputLG: {
    margin: theme.spacing.unit,
    flexBasis: '250px',
    flexGrow: '1',
  },
  inputXL: {
    margin: theme.spacing.unit,
    width: '100%',
  },
  logsList: {
    overflow: 'auto',
    maxHeight: 300,
    backgroundColor: theme.palette.background.paper,
    paddingTop: 0,
    flex: 1,
  },
  logsCheckbox: {
    width: 'auto',
    height: 'auto',
  },
}))
@view
export default class BottleForm extends Component {
  cancelling = false

  store = store({
    bottle: bottlesStore.initial(),
    loading: Boolean(this.props.id),
    open: true,
    saving: false,
    errors: {
      etiquette: undefined,
      bottle: undefined,
    },
    validation: {
      etiquette: false,
      bottle: false,
    },
  })

  async componentDidMount() {
    const {id} = this.props

    if (id) {
      this.store.bottle = await bottlesStore.fetch(this.props.id)
      this.store.loading = false
    }

    this.validate()

    logsStore.on()
  }

  componentWillUnmount() {
    logsStore.off()
  }

  render() {
    const {id} = this.props
    const {loading, open, saving, validation, errors} = this.store

    return (
      <FormDialog
        open={open}
        onCancel={this.handleCancel}
        onExited={this.handleExited}
        onSubmit={this.handleSubmit}
        title={id ? 'Edit bottle' : 'New bottle'}
        error={errors.bottle}
        valid={validation.bottle}
        saving={saving}
        loading={loading}
      >
        {this.renderForm()}
      </FormDialog>
    )
  }

  renderForm() {
    const {classes} = this.props
    const {bottle, errors} = this.store

    let selectedLogs = Object.keys(bottle.logs).map(id => logsStore.find(id))
    selectedLogs = logsStore.sort(selectedLogs, 'when')

    const availableLogs = logsStore.sort(logsStore.list, '-when')

    return (
      <FormContainer>
        <FormRow>
          <SelectField
            label="Etiquette"
            value={bottle.etiquette}
            required={true}
            error={null !== errors.etiquette}
            helperText={errors.etiquette}
            onChange={this.handleFieldChange('etiquette')}
            className={classes.inputMD}
            options={etiquettesStore.list}
            labelAccessor={etiquette =>
              `${etiquette.sort} ${etiquette.appellation}`
            }
            keyAccessor="id"
            valueAccessor="$ref"
          />
          <SelectField
            label="Cellar"
            value={bottle.cellar}
            onChange={this.handleFieldChange('cellar')}
            className={classes.inputMD}
            options={cellarsStore.list}
            labelAccessor={cellar => cellar.title}
            keyAccessor="id"
            valueAccessor="$ref"
          />
        </FormRow>
        <FormRow>
          <List className={classes.logsList}>
            <ListSubheader>Selected logs</ListSubheader>
            {selectedLogs.map(
              log =>
                log
                  ? this.renderLog(
                      log,
                      Boolean(bottle.logs[log.$ref.id]),
                      false
                    )
                  : null
            )}
          </List>
          <List className={classes.logsList}>
            <ListSubheader>Latest logs</ListSubheader>
            {availableLogs.map(
              log =>
                log
                  ? this.renderLog(log, Boolean(bottle.logs[log.$ref.id]), true)
                  : null
            )}
          </List>
        </FormRow>
      </FormContainer>
    )
  }

  renderLog(log, selected, withCheckbox) {
    const {classes} = this.props

    return (
      <ListItem
        key={log.$ref.id}
        dense
        button
        onClick={this.handleToggleLog(log)}
      >
        {withCheckbox ? (
          <Checkbox
            checked={selected}
            tabIndex={-1}
            disableRipple
            className={classes.logsCheckbox}
          />
        ) : null}
        <ListItemText
          primary={`(${log.direction}) ${formatDate(log.when, 'L')} ${log.how}`}
        />
        {!withCheckbox ? <RemoveIcon /> : null}
      </ListItem>
    )
  }

  handleToggleLog = log => () => {
    const {bottle} = this.store
    const {id} = log.$ref

    if (bottle.logs[id]) {
      delete bottle.logs[id]
    } else {
      bottle.logs[id] = log.$ref
    }
  }

  handleCancel = () => {
    this.cancelling = true
    this.store.open = false
  }

  handleExited = () => {
    const {history} = this.props

    if (this.cancelling && history.length > 1) {
      history.goBack()
    } else {
      history.push('/bottles')
    }
  }

  handleFieldChange = name => value => {
    this.store.bottle[name] = value
    this.validateField(name, value)
  }

  handleSubmit = async event => {
    event.preventDefault()

    this.cancelling = false

    const {validation, errors} = this.store

    if (validation.bottle) {
      this.store.saving = true

      const {bottle} = this.store
      const {id} = this.props

      if (status.connected) {
        try {
          await bottlesStore.save(bottle, id)
          this.store.open = false
        } catch (error) {
          errors.form = error.message
          this.store.saving = false
        }
      } else {
        await bottlesStore.save(bottle, id)
        this.store.open = false
      }
    }
  }

  validate() {
    const {bottle, validation} = this.store

    Object.keys(bottle).forEach(name => {
      if (undefined !== validation[name]) {
        this.validateField(name, bottle[name])
      }
    })
  }

  validateField(name, value) {
    const {errors, validation} = this.store
    let error = null

    switch (name) {
      case 'etiquette':
        error = value ? null : 'Please select an etiquette'
        break
      default:
        break
    }

    errors[name] = error
    validation[name] = null === error
    this.validateForm()
  }

  validateForm() {
    const {validation} = this.store
    validation.bottle = true
    validation.bottle = Object.values(validation).reduce(
      (valid, previous) => previous && valid,
      true
    )
  }
}
