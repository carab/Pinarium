import React from 'react'
import {Link, Match} from '@reach/router'
import {observer} from 'mobx-react-lite'
import {Trans, useTranslation} from 'react-i18next/hooks'
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

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  listBottom: {
    flexGrow: 0,
    marginTop: 'auto',
  },
}))

export default observer(function Sidebar() {
  const classes = useStyles()
  const [t] = useTranslation()

  const handleClose = () => {
    ui.toggleSidebar(false)
  }

  const routes = [
    {
      to: '/',
      title: <Trans i18nKey="sidebar.bottles" />,
      icon: <BottleIcon />,
    },
    {
      to: '/cellars',
      title: <Trans i18nKey="sidebar.cellars" />,
      icon: <CellarIcon />,
    },
    {
      to: '/history',
      title: <Trans i18nKey="sidebar.history" />,
      icon: <LogIcon />,
    },
    // {
    //   to: "/shelves",
    //   title: "My Shelves",
    //   icon: <ShelfIcon />
    // },
    {
      to: '/settings',
      title: <Trans i18nKey="sidebar.settings" />,
      icon: <SettingsIcon />,
    },
  ]

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: classnames(classes.drawerPaper, {
          [classes.drawerPaperClose]: !ui.sidebar.open,
        }),
      }}
      open={ui.sidebar.open}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={handleClose} title={t('sidebar.close')}>
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
                //onClick={handleClose}
              >
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.title} />
              </MenuItem>
            )}
          </Match>
        ))}
      </MenuList>
      <Divider />
      <List className={classes.listBottom}>
        <ListItem button component="a" href="https://github.com/carab/Pinarium">
          <ListItemIcon>
            <BugIcon />
          </ListItemIcon>
          <ListItemText primary={<Trans i18nKey="sidebar.report" />} />
        </ListItem>
      </List>
    </Drawer>
  )
})
