import React, {Component, Fragment} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Reboot from 'material-ui/Reboot'
import {withStyles} from 'material-ui/styles'

import UserProvider from './providers/UserProvider'
import SignIn from './user/SignIn'
import SignUp from './user/SignUp'
import SignOut from './user/SignOut'
import Topbar from './layout/Topbar'
import Sidebar from './layout/Sidebar'
import Main from './layout/Main'

import './App.css'
import 'typeface-roboto'

@withStyles(theme => ({
  layout: {
    display: 'flex',
  },
  main: {
    flex: 1,
  },
}))
export default class App extends Component {
  render() {
    const {classes} = this.props

    return (
      <BrowserRouter>
        <div className={classes.layout}>
          <Reboot />
          <Sidebar />
          <div className={classes.main}>
            <Topbar />
            <UserProvider>
              <Switch>
                <Route path="/signin" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <Route path="/signout" component={SignOut} />
                <Route path="/" component={Main} />
              </Switch>
            </UserProvider>
          </div>
        </div>
      </BrowserRouter>
    )
  }
}
