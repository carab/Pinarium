import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import {navigate} from '@reach/router';
import _groupBy from 'lodash/groupBy';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import {makeStyles} from '@material-ui/styles';

import {
  MoreIcon,
  EditIcon,
  PickIcon,
  UnpickIcon,
  DrinkIcon,
  MoveIcon,
  GiveIcon,
  SellIcon,
  DuplicateIcon,
  DeleteIcon,
  ApplyIcon,
} from '../ui/Icons';
import LogEditDialog from '../logs/LogEditDialog';
import useAnchor from '../hooks/useAnchor';

import logsStore from '../stores/logsStore';
import bottlesStore from '../stores/bottlesStore';
import {useUser} from '../stores/userStore';
import uiStore from '../stores/ui';
import statusesDef, {defaultStatuses} from '../enums/statuses';

const useStyles = makeStyles(theme => ({
  delete: {
    color: theme.palette.error.main,
  },
}));

const ICONS = {
  bought: SellIcon,
  received: GiveIcon,
  picked: PickIcon,
  unpicked: UnpickIcon,
  drank: DrinkIcon,
  moved: MoveIcon,
  given: GiveIcon,
  sold: SellIcon,
};

export default observer(function BottleMenu({bottles}) {
  const [user] = useUser();
  const [log, setLog] = useState(null);
  const [anchor, open, onOpen, onClose] = useAnchor();

  const classes = useStyles();
  const [t] = useTranslation();

  const handleCreateLog = status => () => {
    onClose();

    const filteredBottles = bottles
      .filter(bottle => bottle.$ref)
      .filter(bottle => {
        const statusDef = statusesDef.find(
          statusDef => statusDef.name === bottle.status
        );
        const nextStatuses = statusDef ? statusDef.next : defaultStatuses;
        return nextStatuses.indexOf(status) !== -1;
      })
      .map(bottle => bottle.$ref);

    const log = logsStore.createFrom({
      status,
      // Only keep bottles on which the new status is a possible next status
      bottles: filteredBottles,
      cellar: user.defaultCellar,
    });

    setLog(log);
  };

  function handleCloseLog(log) {
    setLog(null);
  }

  function handleEdit() {
    onClose();

    if (bottles.length === 1) {
      navigate(`/bottle/${bottles[0].$ref.id}`);
    } else if (bottles.length) {
      uiStore.dialogs.bottle.bottles = bottles;
    }
  }

  function handleOpenDelete() {
    onClose();
    uiStore.bottleDeleteDialog.bottles = bottles;
  }

  async function handleApplyLogs() {
    onClose();
    await bottlesStore.applyLogs(bottles.map(bottle => bottle.$ref));
  }

  // Build status change items from all bottles current status
  const allNextStatuses = bottles
    .map(bottle => bottle.status)
    .map(status => statusesDef.find(statusDef => statusDef.name === status))
    .map(statusDef => (statusDef ? statusDef.next : defaultStatuses))
    .reduce(
      (accumulator, nextStatuses) => [...accumulator, ...nextStatuses],
      []
    );
  const groups = _groupBy(allNextStatuses);
  const items = Object.keys(groups).map(status => ({
    status,
    count: groups[status].length,
  }));

  const showCount = bottles.length > 1;

  return (
    <>
      <LogEditDialog log={log} onClose={handleCloseLog} />
      <IconButton
        aria-owns={open ? 'menu-bottle' : undefined}
        aria-haspopup="true"
        onClick={onOpen}
        color="inherit"
        title={t('bottle.menu.open')}
        aria-label={t('bottle.menu.open')}
      >
        <MoreIcon />
      </IconButton>
      <Menu
        id="menu-bottle"
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={onClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          {t('label.edit')} {showCount ? ` (${bottles.length})` : null}
        </MenuItem>
        <Divider />
        {items.map(item => {
          const Icon = ICONS[item.status];
          return (
            <MenuItem key={item.status} onClick={handleCreateLog(item.status)}>
              {Icon ? (
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
              ) : null}
              {t(`enum.status.${item.status}`, {
                count: item.count,
              })}
              {showCount ? ` (${item.count})` : null}
            </MenuItem>
          );
        })}
        {items.length ? <Divider /> : null}
        <MenuItem onClick={handleApplyLogs}>
          <ListItemIcon>
            <ApplyIcon />
          </ListItemIcon>
          {t('job.apply_logs')}
        </MenuItem>
        {bottles.length === 1 ? (
          <MenuItem onClick={onClose}>
            <ListItemIcon>
              <DuplicateIcon />
            </ListItemIcon>
            {t('label.duplicate')}
          </MenuItem>
        ) : null}
        <MenuItem onClick={handleOpenDelete} className={classes.delete}>
          <ListItemIcon>
            <DeleteIcon className={classes.delete} />
          </ListItemIcon>
          {t('label.delete')}
        </MenuItem>
      </Menu>
    </>
  );
});
