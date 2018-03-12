import {store} from 'react-easy-state'

const uiStore = store({
  sidebar: {
    open: false,
    toggle() {
      uiStore.sidebar.open = !uiStore.sidebar.open
    },
  },
})

export default uiStore
