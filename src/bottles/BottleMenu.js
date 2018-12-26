import React, {useState} from 'react'
import _groupBy from 'lodash/groupBy'
import {observer, useObservable} from 'mobx-react-lite'
import {navigate} from '@reach/router'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import {makeStyles} from '@material-ui/styles'

import {
  MoreIcon,
  EditIcon,
  PickIcon,
  UnpickIcon,
  DrinkIcon,
  UndrinkIcon,
  MoveIcon,
  GiveIcon,
  SellIcon,
  DuplicateIcon,
  DeleteIcon,
} from '../ui/Icons'
import LogDialog from '../logs/LogDialog'

import logs from '../stores/logs'
import bottlesStore from '../stores/bottles'
import {useUser} from '../stores/userStore'
import statusesDef, {defaultStatuses} from '../enums/statuses'

const useStyles = makeStyles(theme => ({
  delete: {
    color: theme.palette.error.main,
  },
}))

const ICONS = {
  bought: SellIcon,
  received: GiveIcon,
  picked: PickIcon,
  unpicked: UnpickIcon,
  drank: DrinkIcon,
  moved: MoveIcon,
  given: GiveIcon,
  sold: SellIcon,
}

export default observer(function BottleMenu({bottles, showEdit}) {
  const ui = useObservable({delete: {open: false}})
  const user = useUser()
  const [log, setLog] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const classes = useStyles()

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = event => {
    setAnchorEl(null)
  }

  const handleCreateLog = status => event => {
    handleClose(event)

    const filteredBottles = bottles
      .filter(bottle => bottle.$ref)
      .filter(bottle => {
        const statusDef = statusesDef.find(
          statusDef => statusDef.name === bottle.status
        )
        const nextStatuses = statusDef ? statusDef.next : defaultStatuses
        return nextStatuses.indexOf(status) !== -1
      })
      .map(bottle => bottle.$ref)
    console.log(filteredBottles)

    const log = logs.createFrom(
      {
        status,
        // Only keep bottles on which the new status is a possible next status
        bottles: filteredBottles,
      },
      user
    )

    setLog(log)
  }

  const handleCloseLog = event => {
    setLog(null)
  }

  const handleEdit = event => {
    handleClose(event)
    bottles.forEach(bottle => navigate(`/bottle/${bottle.$ref.id}`))
  }

  // Build status change items from all bottles current status
  const allNextStatuses = bottles
    .map(bottle => bottle.status)
    .map(status => statusesDef.find(statusDef => statusDef.name === status))
    .map(statusDef => (statusDef ? statusDef.next : defaultStatuses))
    .reduce(
      (accumulator, nextStatuses) => [...accumulator, ...nextStatuses],
      []
    )
  const groups = _groupBy(allNextStatuses)
  const items = Object.keys(groups).map(status => ({
    status,
    count: groups[status].length,
  }))

  const showCount = bottles.length > 1

  const handleAskDelete = event => {
    handleClose(event)
    ui.delete.open = true
  }

  const handleCancelDelete = event => {
    ui.delete.open = false
  }

  const handleConfirmDelete = event => {
    handleCancelDelete(event)
    bottlesStore.delete(bottles.map(bottle => bottle.$ref))
  }

  return (
    <>
      <LogDialog log={log} onClose={handleCloseLog} />
      <DeleteBottleDialog
        count={bottles.length}
        open={ui.delete.open}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <IconButton
        aria-owns={open ? 'menu-appbar' : undefined}
        aria-haspopup="true"
        onClick={handleOpen}
        color="inherit"
        title="Open bottle menu"
      >
        <MoreIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        {showEdit
          ? [
              <MenuItem key="edit" onClick={handleEdit}>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                Edit
              </MenuItem>,
              <Divider key="divider" />,
            ]
          : null}
        {items.map(item => {
          const Icon = ICONS[item.status]
          return (
            <MenuItem key={item.status} onClick={handleCreateLog(item.status)}>
              {Icon ? (
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
              ) : null}
              {item.status} {showCount ? `(${item.count})` : null}
            </MenuItem>
          )
        })}
        {items.length ? <Divider /> : null}
        {bottles.length === 1 ? (
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <DuplicateIcon />
            </ListItemIcon>
            Duplicate
          </MenuItem>
        ) : null}
        <MenuItem onClick={handleAskDelete} className={classes.delete}>
          <ListItemIcon>
            <DeleteIcon className={classes.delete} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  )
})

function DeleteBottleDialog({count, open, onConfirm, onCancel}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="delete-dialog-title"
    >
      <DialogTitle id="delete-dialog-title">
        {`Delete ${count} bottles ?`}
      </DialogTitle>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
