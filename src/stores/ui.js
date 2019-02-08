import {observable, action} from 'mobx';

const ui = observable(
  {
    sidebar: {
      open: false,
    },
    searchBar: {
      open: false,
    },
    searchDrawer: {
      open: false,
    },
    topbar: {
      titleRef: null,
      actionsRef: null,
    },
    dialogs: {
      bottle: {
        bottles: [],
      },
    },
    bottleDeleteDialog: {
      bottles: [],
    },
    bottlePage: {
      overed: {},
    },
    toggleSidebar(force) {
      this.sidebar.open =
        typeof force === 'boolean' ? force : !this.sidebar.open;
    },
    toggleSearchBar(force) {
      this.searchBar.open =
        typeof force === 'boolean' ? force : !this.searchBar.open;
    },
  },
  {
    toggleSidebar: action.bound,
    toggleSearchBar: action.bound,
  }
);

export default ui;
