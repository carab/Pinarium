import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {store, view} from 'react-easy-state'
import {withStyles} from 'material-ui/styles'

import TextField from '../form/TextField'
import FormDialog, {FormContainer} from '../ui/FormDialog'

import cellarsStore from '../../stores/cellarsStore'
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
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    width: '100%',
  },
}))
@view
export default class CellarForm extends Component {
  cancelling = false

  store = store({
    cellar: cellarsStore.initial(),
  })

  state = {
    open: true,
    saving: false,
    errors: {
      name: undefined,
      form: undefined,
    },
    validation: {
      name: false,
      form: false,
    },
  }

  async componentDidMount() {
    const {id} = this.props

    if (id) {
      this.store.bottle = await cellarsStore.fetch(this.props.id)
      this.store.loading = false
    }

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
        name={id ? 'Edit cellar' : 'New cellar'}
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
    const {cellar} = this.store

    return (
      <FormContainer>
        <TextField
          label="Name"
          name="name"
          value={cellar.name}
          required={true}
          error={null !== errors.name}
          helperText={errors.name}
          onChange={this.handleFieldChange('name')}
          className={classes.inputXL}
        />
        <TextField
          multiline
          label="Description"
          name="description"
          value={cellar.description}
          onChange={this.handleFieldChange('description')}
          className={classes.inputXL}
        />
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
      history.push('/cellars')
    }
  }

  handleTabChange = (event, tab) => {
    this.setState({tab})
  }

  handleFieldChange = name => value => {
    this.store.cellar[name] = value
    this.validateField(name, value)
  }

  handleSubmit = async event => {
    event.preventDefault()

    this.cancelling = false

    const {validation, errors} = this.state

    if (validation.form) {
      this.setState({saving: true})

      const {cellar} = this.store
      const {id} = this.props

      if (status.connected) {
        try {
          await cellarsStore.save(cellar, id)
          this.setState({open: false})
        } catch (error) {
          errors.form = error.message
          this.setState({
            errors,
            saving: false,
          })
        }
      } else {
        cellarsStore.save(cellar, id)
        this.setState({open: false})
      }
    }
  }

  validate() {
    const {validation} = this.state
    const {cellar} = this.store

    Object.keys(cellar).forEach(name => {
      if (undefined !== validation[name]) {
        this.validateField(name, cellar[name])
      }
    })
  }

  validateField(name, value) {
    const {errors, validation} = this.state
    let error = null

    switch (name) {
      case 'name':
        error = value ? null : 'Please enter a name'
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
