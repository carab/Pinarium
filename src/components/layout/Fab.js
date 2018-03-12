import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {withStyles} from 'material-ui/styles'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'

import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'

import {
  EtiquetteIcon,
  BottleIcon,
  CellarIcon,
  ShelfIcon,
  LogIcon,
} from '../ui/Icons'

const actions = [
  {
    name: 'bottle',
    icon: <BottleIcon />,
    path: '/bottles/new',
  },
  {
    name: 'etiquette',
    icon: <EtiquetteIcon />,
    path: '/etiquettes/new',
  },
  {
    name: 'log',
    icon: <LogIcon />,
    path: '/logs/new',
  },
  {
    name: 'shelf',
    icon: <ShelfIcon />,
    path: '/shelfs/new',
  },
  {
    name: 'cellar',
    icon: <CellarIcon />,
    path: '/cellars/new',
  },
]

@withStyles(theme => ({
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
}))
export default class Fab extends Component {
  state = {
    open: false,
    hidden: false,
  }

  render() {
    const {classes} = this.props
    const {open, hidden} = this.state

    return (
      <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        hidden={hidden}
        icon={<SpeedDialIcon />}
        onBlur={this.handleClose}
        onClick={this.handleClick}
        onClose={this.handleClose}
        onFocus={this.handleOpen}
        onMouseEnter={this.handleOpen}
        onMouseLeave={this.handleClose}
        open={open}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={this.handleClick}
            ButtonProps={{
              component: Link,
              to: {
                pathname: action.path,
                state: {modal: true},
              },
            }}
          />
        ))}
      </SpeedDial>
    )
  }

  handleClick = () => {
    this.setState({
      open: !this.state.open,
    })
  }

  handleOpen = () => {
    this.setState({
      open: true,
    })
  }

  handleClose = () => {
    this.setState({
      open: false,
    })
  }
}
