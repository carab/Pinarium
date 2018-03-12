import React, {Component} from 'react'
import {view} from 'react-easy-state'
import {Redirect, Link} from 'react-router-dom'
import {withStyles} from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'

import {signIn} from '../../api/authApi'
import user from '../../stores/user'

const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i

@withStyles(theme => ({
  input: {
    margin: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
  error: {
    marginTop: theme.spacing.unit * 2,
  },
}))
@view
export default class SignIn extends Component {
  state = {
    email: '',
    password: '',
    errors: {
      email: null,
      password: null,
      form: null,
    },
    validated: false,
  }

  render() {
    const {email, password, errors, validated} = this.state
    const {classes} = this.props

    if (user.signedIn) {
      return <Redirect to="/" />
    }

    return (
      <Dialog open={true} aria-labelledby="form-dialog-title">
        <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
          <DialogTitle id="form-dialog-title">Sign in</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Hello!<br/>
              Please know that you need an account to use Pinarium.
            </DialogContentText>
            <TextField
              type="text"
              label="Email"
              name="email"
              value={email}
              onChange={this.handleChange}
              className={classes.input}
              fullWidth
              error={null !== errors.email}
              helperText={errors.email}
            />
            <TextField
              type="password"
              label="Password"
              name="password"
              value={password}
              onChange={this.handleChange}
              className={classes.input}
              fullWidth
              error={null !== errors.password}
              helperText={errors.password}
            />
            <Typography align="center" color="error" className={classes.error}>
              {errors.form}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              component={Link}
              to="/signup"
              className={classes.button}
            >
              Or sign up ?
            </Button>
            <Button
              color="primary"
              type="submit"
              className={classes.button}
              disabled={!validated}
            >
              Sign in
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }

  handleChange = event => {
    const {target: {value, name}} = event

    this.setState(
      {
        [name]: value,
      },
      () => this.validateField(name, value)
    )
  }

  handleSubmit = async event => {
    event.preventDefault()

    const {validated, email, password} = this.state

    if (validated) {
      try {
        await signIn(email, password)
      } catch (error) {
        const {errors} = this.state
        errors.form = error.message
        this.setState({
          errors,
        })
      }
    }
  }

  validateField(name, value) {
    const {errors} = this.state

    errors.form = null

    switch (name) {
      case 'email':
        errors.email = emailRegex.test(value)
          ? null
          : 'Please enter a valid email'
        break
      case 'password':
        errors.password = value.length > 0 ? null : 'Please enter your password'
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
      validated: !errors.email && !errors.password && !errors.form,
    })
  }
}
