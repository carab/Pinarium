import React, {useState} from 'react'
import {observer, useObservable} from 'mobx-react-lite'
import {Trans, useTranslation} from 'react-i18next/hooks'
import {navigate} from '@reach/router'
import _groupBy from 'lodash/groupBy'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
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
  const [log, setLog] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const classes = useStyles()
  const [t] = useTranslation()

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

    const log = logs.createFrom(
      {
        status,
        // Only keep bottles on which the new status is a possible next status
        bottles: filteredBottles,
      },
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
        title={t('bottle.menu.open')}
        aria-label={t('bottle.menu.open')}
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
                {t('label.edit')}
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
              <Trans
                i18nKey={`enum.status.${item.status}`}
                count={item.count}
              />
              {showCount ? ` (${item.count})` : null}
            </MenuItem>
          )
        })}
        {items.length ? <Divider /> : null}
        {bottles.length === 1 ? (
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <DuplicateIcon />
            </ListItemIcon>
            {t('label.duplicate')}
          </MenuItem>
        ) : null}
        <MenuItem onClick={handleAskDelete} className={classes.delete}>
          <ListItemIcon>
            <DeleteIcon className={classes.delete} />
          </ListItemIcon>
          {t('label.delete')}
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
        <Trans i18nKey="bottle.menu.delete_dialog" values={{count}} />
      </DialogTitle>
      <DialogActions>
        <Button onClick={onCancel}>
          <Trans i18nKey="label.cancel" />
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          <Trans i18nKey="label.yes" />
        </Button>
      </DialogActions>
    </Dialog>
  )
}
