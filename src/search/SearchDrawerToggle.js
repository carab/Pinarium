import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import {IconButton, Badge} from '@material-ui/core';

import {SearchIcon} from '../ui/Icons';

import uiStore from '../stores/ui';
import {useSearch} from '../stores/searchStore';

function SearchDrawerToggle() {
  const [t] = useTranslation();
  const search = useSearch();

  function handleSearchToggle() {
    uiStore.searchDrawer.open = true;
  }

  return (
    <IconButton
      color="inherit"
      aria-label={t('topbar.toggle_search')}
      title={t('topbar.toggle_search')}
      onClick={handleSearchToggle}
    >
      <Badge badgeContent={search.filters.length} color="secondary">
        <SearchIcon />
      </Badge>
    </IconButton>
  );
}

export default observer(SearchDrawerToggle);
