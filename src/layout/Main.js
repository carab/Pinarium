import React from 'react'
import {Router, Redirect} from '@reach/router'
import {observer} from 'mobx-react-lite'
import {makeStyles} from '@material-ui/styles'

import Topbar from './Topbar'
import Sidebar from './Sidebar'
import Fab from './Fab'
import BottleList from '../bottles/BottleList'
import BottleForm from '../bottles/BottleForm'
import CellarList from '../cellars/CellarList'
import CellarForm from '../cellars/CellarForm'
import UserSettings from '../user/UserSettings'

import auth from '../stores/auth'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  spacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
}))

export default observer(function Main() {
  if (null === auth.user) {
    return <Redirect to="/signin" noThrow />
  }

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Topbar />
      <Sidebar />
      <Fab />
      <main className={classes.content}>
        <div className={classes.spacer} />
        <Router>
          <Redirect from="/" to="/bottles" noThrow />
          <BottleList path="/bottles/*" />
          <BottleForm path="/bottle" />
          <BottleForm path="/bottle/:id" />
          <CellarList path="/cellars" />
          <CellarForm path="/cellar" />
          <CellarForm path="/cellar/:id" />
          <UserSettings path="/settings" />
        </Router>
      </main>
    </div>
  )
})
