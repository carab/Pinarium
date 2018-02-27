import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {withStyles} from 'material-ui/styles'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'

@withStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
}))
export default class Fab extends Component {
  render() {
    const {classes} = this.props

    return (
      <Button
        variant="fab"
        color="secondary"
        aria-label="Add a crate"
        className={classes.fab}
        component={Link}
        to={{
          pathname: '/crates/new',
          state: {modal: true},
        }}
      >
        <AddIcon />
      </Button>
    )
  }
}
