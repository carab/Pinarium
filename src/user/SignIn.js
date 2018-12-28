import React, {useCallback} from 'react'
import {Trans} from 'react-i18next/hooks'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/styles'
import {observer, useObservable} from 'mobx-react-lite'
import {Redirect} from '@reach/router'

import {SignInIcon} from '../ui/Icons'

import {signIn} from '../api/auth'
import auth from '../stores/auth'

const useStyles = makeStyles(theme => ({
  main: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
}))

export default observer(function SignIn() {
  const classes = useStyles()

  const form = useObservable({
    email: '',
    password: '',
    error: null,
  })

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault()

      try {
        await signIn(form.email, form.password)
      } catch (error) {
        form.error = error.code // @todo map code to labels
      }
    },
    [form.email, form.password]
  )

  const handleChange = useCallback(event => {
    form[event.target.name] = event.target.value
  }, [])

  if (auth.user) {
    return <Redirect to="/" noThrow />
  }

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <SignInIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          <Trans i18nKey="signin.title" />
        </Typography>
        {form.error ? (
          <Typography color="error">{form.error}</Typography>
        ) : null}
        <form className={classes.form} onSubmit={handleSubmit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">
              <Trans i18nKey="signin.email" />
            </InputLabel>
            <Input
              id="email"
              name="email"
              autoComplete="email"
              autoFocus
              value={form.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">
              <Trans i18nKey="signin.password" />
            </InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label={<Trans i18nKey="signin.remember" />}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            <Trans i18nKey="signin.submit" />
          </Button>
        </form>
      </Paper>
    </main>
  )
})
