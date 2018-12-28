import React, {Component} from 'react'
import {Router} from '@reach/router'
import {createMuiTheme} from '@material-ui/core/styles'
import {ThemeProvider} from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import indigo from '@material-ui/core/colors/indigo'
import pink from '@material-ui/core/colors/pink'
import {MuiPickersUtilsProvider} from 'material-ui-pickers'
import DateFnsUtils from '@date-io/date-fns'

import SignIn from './user/SignIn'
import Main from './layout/Main'
import AuthProvider from './providers/AuthProvider'
import UserProvider from './providers/UserProvider'

const theme = createMuiTheme({
  palette: {
    primary: pink,
    secondary: indigo,
  },
  typography: {
    useNextVariants: true,
  },
})

export default class App extends Component {
  render() {
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <AuthProvider>
          <UserProvider>
            <CssBaseline />
            <Router>
              <SignIn path="signin" />
              <Main path="*" />
            </Router>
          </UserProvider>
        </AuthProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  )
  }
}
