import React from 'react'
import {Link, Match} from '@reach/router'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next/hooks'
import classnames from 'classnames'
import {makeStyles} from '@material-ui/styles'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'

import {
  ChevronLeftIcon,
  LogoIcon,
  BugIcon,
  BottleIcon,
  CellarIcon,
  ShelfIcon,
  LogIcon,
  SettingsIcon,
} from '../ui/Icons'

import ui from '../stores/ui'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
  },
  paper: {
    position: 'static',
    display: 'flex',
    height: '100%',
    flexGrow: '0',
    flexDirection: 'column',
    width: theme.spacing.unit * 32,
    maxWidth: `calc(100vw - ${theme.spacing.unit * 8}px)`,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing.unit,
    ...theme.mixins.toolbar,
  },
  title: {
    marginRight: 'auto',
  },
  bottom: {
    flexGrow: 0,
    marginTop: 'auto',
  },
}))

export default function Sidebar() {
  const handleClose = () => {
    ui.toggleSidebar(false)
  }

  return (
    <>
      <Hidden mdUp>
        <SidebarDrawer
          variant="temporary"
          anchor="left"
          onClose={handleClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        />
      </Hidden>
      <Hidden smDown implementation="css">
        <SidebarDrawer
          variant="permanent"
          anchor="left"
          onClose={handleClose}
        />
      </Hidden>
    </>
  )
}

export const SidebarDrawer = observer(function({onClose, ...props}) {
  const classes = useStyles()
  const [t] = useTranslation()

  const routes = [
    {
      to: '/',
      title: t('sidebar.bottles'),
      icon: <BottleIcon />,
    },
    {
      to: '/cellars',
      title: t('sidebar.cellars'),
      icon: <CellarIcon />,
    },
    {
      to: '/history',
      title: t('sidebar.history'),
      icon: <LogIcon />,
    },
    // {
    //   to: "/shelves",
    //   title: "My Shelves",
    //   icon: <ShelfIcon />
    // },
    {
      to: '/settings',
      title: t('sidebar.settings'),
      icon: <SettingsIcon />,
    },
  ]

  return (
    <Drawer
      onClose={onClose}
      open={ui.sidebar.open}
      {...props}
      className={classes.root}
      classes={{
        paper: classes.paper,
      }}
    >
      <div className={classes.toolbar}>
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
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          {t('topbar.title')}
        </Typography>
        <IconButton onClick={onClose} title={t('sidebar.close')}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <MenuList role="menu" className={classes.menu}>
        {routes.map(route => (
          <Match key={route.to} path={route.to}>
            {({match}) => (
              <MenuItem
                selected={null !== match}
                component={Link}
                to={route.to}
                onClick={onClose}
              >
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.title} />
              </MenuItem>
            )}
          </Match>
        ))}
      </MenuList>
      <Divider />
      <List className={classes.bottom}>
        <ListItem button component="a" href="https://github.com/carab/Pinarium">
          <ListItemIcon>
            <BugIcon />
          </ListItemIcon>
          <ListItemText primary={t('sidebar.report')} />
        </ListItem>
      </List>
    </Drawer>
  )
})
