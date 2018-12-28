import React from 'react'
import {makeStyles} from '@material-ui/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
  },
}))

export function MainLoader() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <CircularProgress size={100} />
    </div>
  )
}
