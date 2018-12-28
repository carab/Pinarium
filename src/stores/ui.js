import {observable, action} from 'mobx'

const ui = observable(
  {
    sidebar: {
      open: false,
    },
    searchbar: {
      open: false,
    },
    toggleSidebar(force) {
      this.sidebar.open =
        typeof force === 'boolean' ? force : !this.sidebar.open
    },
    toggleSearchbar(force) {
      this.searchbar.open =
        typeof force === 'boolean' ? force : !this.searchbar.open
    },
  },
  {
    toggleSidebar: action.bound,
    toggleSearchbar: action.bound,
  }
)

export default ui
