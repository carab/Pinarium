import React, {Component} from 'react'
import classnames from 'classnames'
import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Toolbar from 'material-ui/Toolbar'

@withStyles(theme => ({
  root: {
    margin: theme.spacing.unit * 2,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    maxWidth: '30em',
  },
  full: {
    maxWidth: 'none',
    margin: theme.spacing.unit * 2,
  },
}))
export default class Container extends Component {
  render() {
    const {classes, title, full, children} = this.props
    const className = classnames(classes.root, {
      [classes.full]: full,
    })

    return (
      <Paper className={className}>
        <Toolbar>
          <Typography variant="subheading">{title}</Typography>
        </Toolbar>
        {children}
      </Paper>
    )
  }
}
