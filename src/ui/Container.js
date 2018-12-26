import React from 'react'
import classnames from 'classnames'
import {makeStyles} from '@material-ui/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {lighten} from '@material-ui/core/styles/colorManipulator'

const useStyles = makeStyles(theme => ({
  sm: {
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  highlighted:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  actions: {
    marginLeft: 'auto',
  },
  title: {},
}))

export default function Container({
  title,
  actions,
  children,
  size,
  highlighted,
  className,
  ...props
}) {
  const classes = useStyles()

  return (
    <Paper
      {...props}
      className={classnames(className, {
        [classes.sm]: size === 'sm',
      })}
    >
      <Toolbar
        className={classnames(className, {
          [classes.highlighted]: highlighted,
        })}
      >
        <div className={classes.title}>
          <Typography variant="h6" color="inherit">
            {title}
          </Typography>
        </div>
        <div className={classes.actions}>{actions}</div>
      </Toolbar>
      {children}
    </Paper>
  )
}
