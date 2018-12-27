import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {store, view} from 'react-easy-state'
import {withStyles} from 'material-ui/styles'

import SelectField from '../form/SelectField'
import TextField from '../form/TextField'
import DateField from '../form/DateField'
import FormDialog, {FormContainer, FormRow} from '../ui/FormDialog'

import bottlesStore from '../../stores/bottlesStore'
import etiquettesStore from '../../stores/etiquettesStore'
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
}))
@view
export default class BottleWizardForm extends Component {
  cancelling = false

  store = store({
    form: {},
  })

  state = {
    open: true,
    saving: false,
    errors: {
      quantity: undefined,
      etiquette: undefined,
      form: undefined,
    },
    validation: {
      quantity: false,
      etiquette: false,
      form: false,
    },
  }

  componentDidMount() {
    this.validate()
  }

  render() {
    const {open, saving, validation, errors} = this.state
    const {id} = this.props

    return (
      <FormDialog
        open={open}
        onCancel={this.handleCancel}
        onExited={this.handleExited}
        onSubmit={this.handleSubmit}
        title={id ? 'Edit bottle' : 'New bottles'}
        error={errors.form}
        valid={validation.form}
        saving={saving}
      >
        {this.renderForm()}
      </FormDialog>
    )
  }

  renderForm() {
    const {classes} = this.props
    const {errors} = this.state
    const {form} = this.store

    return (
      <FormContainer>
        <FormRow>
          <TextField
            type="number"
            label="Quantity"
            name="quantity"
            value={form.quantity}
            required={true}
            error={null !== errors.quantity}
            helperText={errors.quantity}
            onChange={this.handleFieldChange('quantity')}
            className={classes.inputSM}
          />
          <SelectField
            label="Etiquette"
            value={form.etiquette}
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
      history.push('/bottles')
    }
  }

  handleTabChange = (event, tab) => {
    this.setState({tab})
  }

  handleFieldChange = name => value => {
    this.store.form[name] = value
    this.validateField(name, value)
  }

  handleSubmit = async event => {
    event.preventDefault()

    this.cancelling = false

    const {validation, errors} = this.state

    if (validation.form) {
      this.setState({saving: true})
      
      const {form} = this.store

      if (status.connected) {
        try {
          const promises = []
          for (let i = 0; i < form.quantity; i++) {
            promises.push(bottlesStore.save(this.buildBottle(form)))
          }

          await Promise.all(promises)
          this.setState({open: false})
        } catch (error) {
          errors.form = error.message
          this.setState({
            errors,
            saving: false,
          })
        }
      } else {
        for (let i = 0; i < form.quantity; i++) {
          bottlesStore.save(this.buildBottle(form))
        }

        this.setState({open: false})
      }
    }
  }

  buildBottle(form) {
    const bottle = bottlesStore.initial()
    bottle.etiquette = form.etiquette
    return bottle
  }

  validate() {
    const {validation} = this.state
    const {form} = this.store

    Object.keys(form).forEach(name => {
      if (undefined !== validation[name]) {
        this.validateField(name, form[name])
      }
    })
  }

  validateField(name, value) {
    const {errors, validation} = this.state
    let error = null

    switch (name) {
      case 'quantity':
        error = value > 0 ? null : 'Please enter a positive quantity'
        break
      case 'etiquette':
        error = value ? null : 'Please select an etiquette'
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
    validation.form = true
    validation.form = Object.values(validation).reduce(
      (valid, previous) => previous && valid,
      true
    )

    this.setState({
      validation,
    })
  }
}
