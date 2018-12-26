import React from 'react'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing.unit * 2,
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing.unit,
    },
  },
}))

export default function FieldRow({children}) {
  const classes = useStyles()
  return <div className={classes.root}>{children}</div>
}
