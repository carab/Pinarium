import React, {Component} from 'react'
import {Router} from '@reach/router'
import {createMuiTheme} from '@material-ui/core/styles'
import {ThemeProvider} from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import {MuiPickersUtilsProvider} from 'material-ui-pickers'
import DateFnsUtils from '@date-io/date-fns'

import SignIn from './user/SignIn'
import Main from './layout/Main'
import AuthProvider from './providers/AuthProvider'

const theme = createMuiTheme({
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
            <CssBaseline />
            <Router>
              <SignIn path="signin" />
              <Main path="*" />
            </Router>
          </AuthProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    )
  }
}
