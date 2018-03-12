import React, {Component, Fragment} from 'react'
import {store, view} from 'react-easy-state'
import {withStyles} from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import {CircularProgress} from 'material-ui/Progress'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog'

@withMobileDialog()
@withStyles(theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  saveButtonWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  saveButtonLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  content: {
    padding: 0,
  },
  title: {
    padding: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '16em',
  },
  progress: {
    margin: theme.spacing.unit * 2,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
  },
}))
export default class FormDialog extends Component {
  render() {
    const {
      classes,
      fullScreen,
      children,
      onCancel,
      onSubmit,
      onExited,
      title,
      open,
      loading,
      saving,
      valid,
      error,
    } = this.props

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="form-dialog-title"
        onClose={onCancel}
        onExited={onExited}
      >
        <form
          className={classes.form}
          onSubmit={onSubmit}
          noValidate
          autoComplete="off"
        >
          <DialogTitle id="form-dialog-title" className={classes.title}>
            <AppBar position="static">
              <Toolbar>{title}</Toolbar>
            </AppBar>
          </DialogTitle>
          <DialogContent className={classes.content}>
            {error ? <FormError>{error}</FormError> : null}
            {loading ? (
              <CircularProgress className={classes.progress} />
            ) : (
              children
            )}
          </DialogContent>
          {loading ? null : (
            <DialogActions>
              <Fragment>
                <Button className={classes.button} onClick={onCancel}>
                  Cancel
                </Button>
                <div className={classes.saveButtonWrapper}>
                  <Button
                    color="primary"
                    type="submit"
                    className={classes.button}
                    disabled={saving || !valid}
                  >
                    {saving ? '' : 'Save'}
                  </Button>
                  {saving ? (
                    <CircularProgress
                      size={24}
                      className={classes.saveButtonLoader}
                    />
                  ) : null}
                </div>
              </Fragment>
            </DialogActions>
          )}
        </form>
      </Dialog>
    )
  }
}

@withStyles(theme => ({
  root: {
    margin: theme.spacing.unit,
  },
}))
export class FormError extends Component {
  render() {
    const {children, classes} = this.props
    return (
      <Typography align="center" color="error" className={classes.root}>
        {children}
      </Typography>
    )
  }
}

@withStyles(theme => ({
  root: {
    padding: theme.spacing.unit,
  },
}))
export class FormContainer extends Component {
  render() {
    const {children, classes} = this.props
    return <div className={classes.root}>{children}</div>
  }
}

@withStyles(theme => ({
  root: {
    padding: theme.spacing.unit * 2,
    display: 'flex',
    flexWrap: 'wrap',
  },
}))
export class FormRow extends Component {
  render() {
    const {children, classes} = this.props
    return <div className={classes.root}>{children}</div>
  }
}
