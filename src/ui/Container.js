import React from 'react'
import classnames from 'classnames'
import {makeStyles} from '@material-ui/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {lighten} from '@material-ui/core/styles/colorManipulator'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  sm: {
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
      maxWidth: '600px',
    },
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
  startAdornment,
  endAdornment,
  className,
  ...props
}) {
  const classes = useStyles()

  return (
    <Paper
      {...props}
      className={classnames(className, classes.root, {
        [classes.sm]: size === 'sm',
      })}
    >
      <Toolbar
        className={classnames(className, {
          [classes.highlighted]: highlighted,
        })}
      >
        {startAdornment || null}
        {title ? (
          <div className={classes.title}>
            <Typography variant="h6" color="inherit">
              {title}
            </Typography>
          </div>
        ) : null}
        {endAdornment || null}
        {actions ? <div className={classes.actions}>{actions}</div> : null}
      </Toolbar>
      {children}
    </Paper>
  )
}
