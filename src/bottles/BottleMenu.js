import React, {useState} from 'react'
import _groupBy from 'lodash/groupBy'
import {observer} from 'mobx-react-lite'
import {navigate} from '@reach/router'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import {Divider} from '@material-ui/core'
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
import statusesDef from '../enums/statuses'

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

    const log = logs.createFrom(
      {
        status,
        // Only keep bottles on which the new status is a possible next status
        bottles: bottles
          .filter(bottle => bottle.$ref)
          .filter(bottle => {
            const statusDef = statusesDef.find(
              statusDef => statusDef.name === bottle.status
            )
            return statusDef && statusDef.next.indexOf(status) !== -1
          })
          .map(bottle => bottle.$ref),
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

  const handleDelete = event => {
    bottlesStore.delete(bottles.map(bottle => bottle.$ref))
    handleClose(event)
  }

  // Build status change items from all bottles current status
  const allNextStatuses = bottles
    .map(bottle => bottle.status)
    .map(status => statusesDef.find(statusDef => statusDef.name === status))
    .map(statusDef => (statusDef ? statusDef.next : ['bought', 'received']))
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

  return (
    <>
      <LogDialog log={log} onClose={handleCloseLog} />
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
        <MenuItem onClick={handleDelete} className={classes.delete}>
          <ListItemIcon>
            <DeleteIcon className={classes.delete} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  )
})
