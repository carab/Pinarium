import React from 'react';
import {observer} from 'mobx-react-lite';
import {Fade} from '@material-ui/core';

import SearchForm from './SearchForm';
import uiStore from '../stores/ui';

function SearchBar() {
  const {open} = uiStore.searchBar;
  
  return (
    <Fade in={open} mountOnEnter unmountOnExit>
      <SearchForm />
    </Fade>
  );
}

export default observer(SearchBar);
