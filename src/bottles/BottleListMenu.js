import React from 'react';
import {useTranslation} from 'react-i18next/hooks';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import {VisibilityIcon, CheckIcon} from '../ui/Icons';

import useAnchor from '../hooks/useAnchor';
import {useSearch, VISIBILITIES} from '../stores/searchStore';

function BottleListMenu() {
  const [t] = useTranslation();
  const [anchor, open, onOpen, onClose] = useAnchor();
  const Search = useSearch();

  const id = 'bottle-list-menu';

  function handleChangeVisibility(name) {
    return () => {
      Search.visibility = name;
      onClose();
    };
  }

  return (
    <>
      <IconButton
        aria-owns={anchor ? id : undefined}
        aria-haspopup="true"
        aria-label={t('search.visibility.title')}
        color="inherit"
        onClick={onOpen}
      >
        <VisibilityIcon />
      </IconButton>
      <Menu id={id} anchorEl={anchor} open={open} onClose={onClose}>
        {VISIBILITIES.map(({name}) => {
          const selected = Search.visibility === name;
          return (
            <MenuItem
              key={name}
              selected={selected}
              onClick={handleChangeVisibility(name)}
            >
              {selected && (
                <ListItemIcon>
                  <CheckIcon />
                </ListItemIcon>
              )}
              <ListItemText
                inset={!selected}
                primary={t(`search.visibility.${name}`)}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

export default BottleListMenu;
