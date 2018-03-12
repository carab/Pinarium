import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {store, view} from 'react-easy-state'
import {withStyles} from 'material-ui/styles'

import SelectField from '../form/SelectField'
import TextField from '../form/TextField'
import DateField from '../form/DateField'
import FormDialog, {FormContainer, FormRow} from '../ui/FormDialog'

import status from '../../stores/status'
import logsStore from '../../stores/logsStore'

import directions from '../../enums/directions'
import procurements from '../../enums/procurements'
import ratings from '../../enums/ratings'

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
}))
@view
export default class LogForm extends Component {
  cancelling = false

  store = store({
    log: logsStore.initial(),
    loading: Boolean(this.props.id),
  })

  state = {
    open: true,
    exit: false,
    saving: false,
    errors: {
      direction: undefined,
      when: undefined,
      form: undefined,
    },
    validation: {
      direction: false,
      when: false,
      form: false,
    },
  }

  async componentDidMount() {
    if (this.props.id) {
      this.store.log = await logsStore.find(this.props.id)
      this.store.loading = false
    }

    this.validate()
  }

  render() {
    const {open, saving, validation, errors} = this.state
    const {id} = this.props
    const {loading} = this.store

    return (
      <FormDialog
        open={open}
        onCancel={this.handleCancel}
        onExited={this.handleExited}
        onSubmit={this.handleSubmit}
        title={id ? 'Edit log' : 'New log'}
        error={errors.form}
        valid={validation.form}
        saving={saving}
        loading={loading}
      >
        {this.renderForm()}
      </FormDialog>
    )
  }

  renderForm() {
    const {classes} = this.props
    const {errors} = this.state
    const {log} = this.store

    return (
      <FormContainer>
        <FormRow>
          <SelectField
            required
            label="Direction"
            value={log.direction}
            onChange={this.handleFieldChange('direction')}
            className={classes.inputMD}
            error={null !== errors.direction}
            helperText={errors.direction}
            options={directions.map(direction => ({
              value: direction,
              label: direction,
            }))}
          />
          <DateField
            required
            label="When"
            value={log.when}
            onChange={this.handleFieldChange('when')}
            error={null !== errors.when}
            helperText={errors.when}
            className={classes.inputMD}
          />
          <TextField
            label="Value"
            type="number"
            value={log.value}
            onChange={this.handleFieldChange('value')}
            className={classes.inputSM}
          />
          <SelectField
            label="Rate"
            value={log.rate}
            onChange={this.handleFieldChange('rate')}
            className={classes.inputSM}
            options={ratings.map(rating => ({
              value: rating,
              label: rating,
            }))}
          />
          <SelectField
            label="How"
            value={log.how}
            onChange={this.handleFieldChange('how')}
            className={classes.inputMD}
            options={procurements.map(procurement => ({
              value: procurement,
              label: procurement,
            }))}
          />
          <TextField
            label="Where"
            value={log.where}
            onChange={this.handleFieldChange('where')}
            className={classes.inputMD}
          />
          <TextField
            label="Who"
            value={log.who}
            onChange={this.handleFieldChange('who')}
            className={classes.inputMD}
          />
          <TextField
            multiline
            label="Comment"
            value={log.comment}
            onChange={this.handleFieldChange('comment')}
            className={classes.inputXL}
          />
        </FormRow>
      </FormContainer>
    )
  }

  handleCancel = () => {
    this.cancelling = true
    this.setState({open: false})
  }

  handleExited = () => {
    const {history} = this.props

    if (this.cancelling && history.length > 1) {
      history.goBack()
    } else {
      history.push('/logs')
    }
  }

  handleTabChange = (event, tab) => {
    this.setState({tab})
  }

  handleFieldChange = name => value => {
    this.store.log[name] = value
    this.validateField(name, value)
  }

  handleSubmit = async event => {
    event.preventDefault()

    this.cancelling = false

    const {validation, errors} = this.state

    if (validation.form) {
      this.setState({saving: true})

      const {log} = this.store
      const {id} = this.props

      if (status.connected) {
        try {
          await logsStore.save(log, id)
          this.setState({open: false})
        } catch (error) {
          errors.form = error.message
          this.setState({
            errors,
            saving: false,
          })
        }
      } else {
        logsStore.save(log, id)
        this.setState({open: false})
      }
    }
  }

  validate() {
    const {validation} = this.state
    const {log} = this.store

    Object.keys(log).forEach(name => {
      if (undefined !== validation[name]) {
        this.validateField(name, log[name])
      }
    })
  }

  validateField(name, value) {
    const {errors, validation} = this.state
    let error = null

    switch (name) {
      case 'direction':
        error = value ? null : 'Please select a direction'
        break
      case 'when':
        error = value ? null : 'Please enter a date'
        break
      default:
        break
    }

    errors[name] = error
    validation[name] = null === error

    this.setState(
      {
        errors,
        validation,
      },
      this.validateForm
    )
  }

  validateForm() {
    const {validation} = this.state
    validation.form = validation.when && validation.direction

    this.setState({
      validation,
    })
  }
}
