import React from 'react'
import {Link, Match} from '@reach/router'
import {useTranslation} from 'react-i18next/hooks'
import {observer} from 'mobx-react-lite'
import Zoom from '@material-ui/core/Zoom'
import Fab from '@material-ui/core/Fab'
import {makeStyles, useTheme} from '@material-ui/styles'

import {AddIcon} from '../ui/Icons'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    position: 'relative',
    minHeight: 200,
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: 1,
  },
}))

export default observer(function Bouh() {
  const classes = useStyles()
  const theme = useTheme()
  const [t] = useTranslation()

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  }

  const fabs = [
    {
      path: '/bottles/*',
      to: '/bottle',
      title: t('fab.add_bottle'),
      color: 'primary',
      className: classes.fab,
      icon: <AddIcon />,
    },
    {
      path: '/cellars',
      to: '/cellar',
      title: t('fab.add_cellar'),
      color: 'secondary',
      className: classes.fab,
      icon: <AddIcon />,
    },
  ]

  return fabs.map(fab => (
    <Match path={fab.path} key={fab.color}>
      {({match}) => (
        <Zoom
          in={Boolean(match)}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${match ? transitionDuration.exit : 0}ms`,
          }}
          unmountOnExit
        >
          <Fab
            className={fab.className}
            color={fab.color}
            component={Link}
            to={fab.to}
            title={fab.title}
            aria-label={fab.title}
          >
            {fab.icon}
          </Fab>
        </Zoom>
      )}
    </Match>
  ))
})
