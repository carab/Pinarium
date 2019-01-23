import React from 'react';
import {useTranslation} from 'react-i18next/hooks';

import {
  IconButton,
  Menu,
  MenuList,
  MenuItem,
  ListItemIcon,
  Checkbox,
  Divider,
  ListItemText,
  Dialog,
  DialogTitle,
} from '@material-ui/core';

import {MoreIcon, VisibilityIcon, SortIcon} from '../ui/Icons';

import useAnchor from '../hooks/useAnchor';
import useToggable from '../hooks/useToggable';
import {useSearch, VISIBILITIES} from '../stores/searchStore';

function BottleListMenu() {
  const [t] = useTranslation();
  const [anchor, open, onOpen, onClose] = useAnchor();
  const [visibilityOpen, onToggleVisibility] = useToggable();

  const Search = useSearch();

  const id = 'bottle-list-menu';
  const sortItems = [];
  const currentVisibility = VISIBILITIES.find(
    ({value}) => value === Search.visibility
  );

  function handleOpenVisibility() {
    onToggleVisibility();
    onClose();
  }

  function handleCloseVisibility(value) {
    return () => {
      Search.visibility = value;
      onToggleVisibility();
    };
  }

  return (
    <>
      <IconButton
        aria-owns={anchor ? id : undefined}
        aria-haspopup="true"
        color="inherit"
        onClick={onOpen}
      >
        <MoreIcon />
      </IconButton>
      <Menu id={id} anchorEl={anchor} open={open} onClose={onClose}>
        <MenuItem onClick={handleOpenVisibility}>
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('bottle.list.visibility')}
            secondary={
              currentVisibility
                ? t(`bottle.list.${currentVisibility.name}`)
                : null
            }
          />
        </MenuItem>
        <MenuItem onClick={handleOpenVisibility}>
          <ListItemIcon>
            <SortIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('bottle.list.sort')}
            secondary={
              currentVisibility
                ? t(`bottle.list.${currentVisibility.name}`)
                : null
            }
          />
        </MenuItem>
        <Divider />
        {sortItems.map((sort, i) => (
          <MenuItem key={i} selected={false}>
            <ListItemIcon>
              <Checkbox />
            </ListItemIcon>
            {t(`bottle.${sort.name}`)}
          </MenuItem>
        ))}
      </Menu>
      <VisibilityDialog
        open={visibilityOpen}
        selected={Search.visibility}
        onClose={handleCloseVisibility}
      />
    </>
  );
}

function VisibilityDialog({selected, onClose, ...props}) {
  const [t] = useTranslation();

  return (
    <Dialog
      onClose={onClose(selected)}
      aria-labelledby="visibility-dialog-title"
      {...props}
    >
      <DialogTitle id="visibility-dialog-title">
        {t('bottle.list.visibility')}
      </DialogTitle>
      <MenuList>
        {VISIBILITIES.map(({name, value}) => (
          <MenuItem
            key={name}
            selected={selected === value}
            onClick={onClose(value)}
          >
            {t(`bottle.list.${name}`)}
          </MenuItem>
        ))}
      </MenuList>
    </Dialog>
  );
}

export default BottleListMenu;
