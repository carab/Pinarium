import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {store, view} from 'react-easy-state'
import {withStyles} from 'material-ui/styles'

import SelectField from '../form/SelectField'
import TextField from '../form/TextField'
import DateField from '../form/DateField'
import FormDialog, {FormContainer, FormRow} from '../ui/FormDialog'

import status from '../../stores/status'
import etiquettesStore from '../../stores/etiquettesStore'

import colors from '../../enums/colors'
import effervescences from '../../enums/effervescences'
import sorts from '../../enums/sorts'
import sizes from '../../enums/sizes'

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
export default class EtiquetteForm extends Component {
  cancelling = false

  store = store({
    etiquette: this.props.id ? etiquettesStore.all[this.props.id] : {},
  })

  state = {
    open: true,
    exit: false,
    loading: Boolean(this.props.id),
    saving: false,
    errors: {
      sort: undefined,
      appellation: undefined,
      form: undefined,
    },
    validation: {
      sort: false,
      appellation: false,
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
        title={id ? 'Edit etiquette' : 'New etiquette'}
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
    const {etiquette} = this.store

    return (
      <FormContainer>
        <FormRow>
          <SelectField
            label="Sort"
            value={etiquette.sort}
            required={true}
            onChange={this.handleFieldChange('sort')}
            className={classes.inputSM}
            error={null !== errors.sort}
            helperText={errors.sort}
            options={Object.keys(sorts).map(sort => ({
              value: sort,
              label: sort,
            }))}
          />
          <TextField
            label="Appellation"
            name="appellation"
            required={true}
            value={etiquette.appellation}
            onChange={this.handleFieldChange('appellation')}
            className={classes.inputLG}
            error={null !== errors.appellation}
            helperText={errors.appellation}
          />
          {etiquette.sort &&
          sorts[etiquette.sort] &&
          sorts[etiquette.sort].vintage ? (
            <TextField
              label="Vintage"
              name="vintage"
              value={etiquette.vintage}
              onChange={this.handleFieldChange('vintage')}
              className={classes.inputSM}
            />
          ) : null}
          <TextField
            label="Cuvée"
            name="cuvee"
            value={etiquette.cuvee}
            onChange={this.handleFieldChange('cuvee')}
            className={classes.inputMD}
          />
          {etiquette.sort &&
          sorts[etiquette.sort] &&
          sorts[etiquette.sort].bottlingDate ? (
            <DateField
              label="Bottling date"
              name="bottlingDate"
              value={etiquette.bottlingDate}
              onChange={this.handleFieldChange('bottlingDate')}
              className={classes.inputMD}
            />
          ) : null}
          {etiquette.sort &&
          sorts[etiquette.sort] &&
          sorts[etiquette.sort].expirationDate ? (
            <DateField
              label="Expiration date"
              name="expirationDate"
              value={etiquette.expirationDate}
              onChange={this.handleFieldChange('expirationDate')}
              className={classes.inputMD}
            />
          ) : null}
        </FormRow>
        <FormRow>
          <TextField
            label="Producer"
            name="producer"
            value={etiquette.producer}
            onChange={this.handleFieldChange('producer')}
            className={classes.inputMD}
          />
          <TextField
            label="Region"
            name="region"
            value={etiquette.region}
            onChange={this.handleFieldChange('region')}
            className={classes.inputMD}
          />
          <TextField
            label="Country"
            name="country"
            value={etiquette.country}
            onChange={this.handleFieldChange('country')}
            className={classes.inputMD}
          />
        </FormRow>
        <FormRow>
          <SelectField
            label="Size"
            value={etiquette.size}
            onChange={this.handleFieldChange('size')}
            className={classes.inputMD}
            emptyLabel={<em>None</em>}
            options={sizes.map(size => ({value: size, label: size}))}
          />
          <SelectField
            label="Color"
            value={etiquette.color}
            onChange={this.handleFieldChange('color')}
            className={classes.inputMD}
            emptyLabel={<em>None</em>}
            options={colors.map(color => ({
              value: color,
              label: color,
            }))}
          />
          <SelectField
            label="Effervescence"
            value={etiquette.effervescence}
            onChange={this.handleFieldChange('effervescence')}
            className={classes.inputMD}
            emptyLabel={<em>None</em>}
            options={effervescences.map(effervescence => ({
              value: effervescence,
              label: effervescence,
            }))}
          />
          {etiquette.sort && sorts[etiquette.sort] ? (
            <SelectField
              label="Type"
              value={etiquette.type}
              onChange={this.handleFieldChange('type')}
              className={classes.inputMD}
              emptyLabel={<em>None</em>}
              options={sorts[etiquette.sort].types.map(type => ({
                value: type,
                label: type,
              }))}
            />
          ) : null}
        </FormRow>
        <FormRow>
          <TextField
            label="Capsule"
            name="capsule"
            value={etiquette.capsule}
            onChange={this.handleFieldChange('capsule')}
            className={classes.inputSM}
          />
          <TextField
            type="number"
            label="Alcohol"
            name="alcohol"
            value={etiquette.alcohol}
            onChange={this.handleFieldChange('alcohol')}
            className={classes.inputSM}
          />
          <TextField
            label="Medal/Prize"
            name="medal"
            value={etiquette.medal}
            onChange={this.handleFieldChange('medal')}
            className={classes.inputMD}
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
      history.push('/etiquettes')
    }
  }

  handleTabChange = (event, tab) => {
    this.setState({tab})
  }

  handleFieldChange = name => value => {
    this.store.etiquette[name] = value
    this.validateField(name, value)
  }

  handleSubmit = async event => {
    event.preventDefault()

    this.cancelling = false

    const {validation, errors} = this.state

    if (validation.form) {
      this.setState({saving: true})

      const {etiquette} = this.store
      const {id} = this.props

      if (status.connected) {
        try {
          await etiquettesStore.save(etiquette, id)
          this.setState({open: false})
        } catch (error) {
          errors.form = error.message
          this.setState({
            errors,
            saving: false,
          })
        }
      } else {
        etiquettesStore.save(etiquette, id)
        this.setState({open: false})
      }
    }
  }

  validate() {
    const {validation} = this.state
    const {etiquette} = this.store

    Object.keys(etiquette).forEach(name => {
      if (undefined !== validation[name]) {
        this.validateField(name, etiquette[name])
      }
    })
  }

  validateField(name, value) {
    const {errors, validation} = this.state
    let error = null

    switch (name) {
      case 'appellation':
        error = value.length > 0 ? null : 'Please enter an appellation'
        break
      case 'sort':
        error = value.length > 0 ? null : 'Please select a sort'
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
    validation.form = validation.sort && validation.appellation

    this.setState({
      validation,
    })
  }
}
