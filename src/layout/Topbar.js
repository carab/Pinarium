import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next/hooks'
import classnames from 'classnames'
import {makeStyles} from '@material-ui/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

import Searchbar from './Searchbar'
import {MenuIcon, SearchIcon, CloseIcon} from '../ui/Icons'

import ui from '../stores/ui'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  toolbar: {
    paddingRight: theme.spacing.unit, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  menuButtonHidden: {
    display: 'none',
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
  }

  return (
    <AppBar
      position="absolute"
      className={classnames(classes.appBar, {
        [classes.appBarShift]: ui.sidebar.open,
      })}
      color={ui.searchbar.open ? 'default' : 'primary'}
    >
      <Toolbar disableGutters={!ui.sidebar.open} className={classes.toolbar}>
        <IconButton
          color="inherit"
          aria-label={t('topbar.open_sidebar')}
          title={t('topbar.open_sidebar')}
          onClick={handleOpenSidebar}
          className={classnames(
            classes.menuButton,
            ui.sidebar.open && classes.menuButtonHidden
          )}
        >
          <MenuIcon />
        </IconButton>
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
