import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next/hooks'
import {navigate, Link} from '@reach/router'
import {makeStyles} from '@material-ui/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'

import Searchbar from './Searchbar'
import {MenuIcon, SearchIcon, CloseIcon, LogoIcon} from '../ui/Icons'

import ui from '../stores/ui'
import searchStore from '../stores/searchStore'

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  toolbar: {
    paddingRight: theme.spacing.unit,
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  title: {
    marginRight: 'auto',
  },
}))

export default observer(function Topbar() {
  const classes = useStyles()
  const [t] = useTranslation()

  const handleOpenSidebar = () => {
    ui.toggleSidebar(true)
  }

  const handleToggleSearch = () => {
    ui.toggleSearchbar()
    if (!ui.searchbar.open) {
      searchStore.filters = []
      navigate('/bottles')
    }
  }

  return (
    <AppBar
      position="absolute"
      className={classes.root}
      color={ui.searchbar.open ? 'default' : 'primary'}
    >
      <Toolbar disableGutters={!ui.sidebar.open} className={classes.toolbar}>
        <Hidden mdUp>
          <IconButton
            color="inherit"
            aria-label={t('topbar.open_sidebar')}
            title={t('topbar.open_sidebar')}
            onClick={handleOpenSidebar}
            className={classes.button}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Hidden smDown implementation="css">
          <IconButton
            color="inherit"
            aria-label={t('topbar.home')}
            title={t('topbar.home')}
            className={classes.button}
            component={Link}
            to="/"
          >
            <LogoIcon />
          </IconButton>
        </Hidden>
        {ui.searchbar.open ? null : (
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {t('topbar.title')}
          </Typography>
        )}
        <Searchbar />
        <IconButton
          color="inherit"
          aria-label={t('topbar.toggle_searchbar')}
          title={t('topbar.toggle_searchbar')}
          onClick={handleToggleSearch}
        >
          {ui.searchbar.open ? <CloseIcon /> : <SearchIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  )
})
