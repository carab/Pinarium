import '@babel/polyfill'
import React, {Component, Fragment} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Reboot from 'material-ui/Reboot'
import {withStyles} from 'material-ui/styles'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'

import SignIn from './components/user/SignIn'
import SignUp from './components/user/SignUp'
import SignOut from './components/user/SignOut'
import Topbar from './components/layout/Topbar'
import Sidebar from './components/layout/Sidebar'
import Main from './components/layout/Main'
import UserProvider from './components/providers/UserProvider'

import './App.css'
import 'typeface-roboto'

@withStyles(theme => ({
  root: {
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    overflow: 'auto',
  },
}))
export default class App extends Component {
  render() {
    const {classes} = this.props

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <BrowserRouter>
          <div className={classes.root}>
            <Reboot />
            <Topbar />
            <div className={classes.main}>
              <Sidebar />
              <div className={classes.content}>
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
          </div>
        </BrowserRouter>
      </MuiPickersUtilsProvider>
    )
  }
}
