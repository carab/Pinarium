import React, {Component} from 'react'
import {view} from 'react-easy-state'
import {withStyles} from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import {createCellar} from '../api/cellarApi'

@withStyles(theme => ({
  input: {
    margin: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
}))
@view
export default class CellarForm extends Component {
  state = {
    cellar: {
      title: '',
      description: '',
    },
    errors: {
      title: null,
      form: null,
    },
    validated: false,
  }

  render() {
    const {cellar: {title, description}, validated, errors} = this.state
    const {classes} = this.props

    return (
      <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
        <Typography variant="title">Create a cellar</Typography>
        <TextField
          type="text"
          label="Title"
          name="title"
          value={title}
          onChange={this.handleChange}
          className={classes.input}
          error={null !== errors.title}
          helperText={errors.title}
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={description}
          onChange={this.handleChange}
          className={classes.input}
          fullWidth
          multiline
        />
        <Button
          color="primary"
          type="submit"
          className={classes.button}
          disabled={!validated}
        >
          Create
        </Button>
      </form>
    )
  }

  handleChange = event => {
    const {target: {value, name}} = event
    const {cellar} = this.state

    this.setState(
      {
        cellar: {
          ...cellar,
          [name]: value,
        },
      },
      () => this.validateField(name, value)
    )
  }

  handleSubmit = async event => {
    event.preventDefault()

    const {cellar, validated} = this.state

    if (validated) {
      try {
        await createCellar(cellar)
        this.setState({
          cellar: {
            title: '',
            description: '',
          },
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  validateField(name, value) {
    const {errors} = this.state

    switch (name) {
      case 'title':
        errors.title = value.length > 0 ? null : 'Please enter a title'
        break
      default:
        break
    }

    this.setState(
      {
        errors,
      },
      this.validateForm
    )
  }

  validateForm() {
    const {errors} = this.state

    this.setState({
      validated: !errors.title,
    })
  }
}
