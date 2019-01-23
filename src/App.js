import React from 'react';
import {Router} from '@reach/router';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import {MuiPickersUtilsProvider} from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';

import SignIn from './user/SignIn';
import Main from './layout/Main';
import AuthProvider from './providers/AuthProvider';
import UserProvider from './providers/UserProvider';
import LocaleProvider from './providers/LocaleProvider';

import {getLocaleData} from './lib/date';
import useLocale from './hooks/useLocale';

const theme = createMuiTheme({
  palette: {
    primary: pink,
    secondary: indigo,
  },
  typography: {
    useNextVariants: true,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocaleProvider>
        <PickersProvider>
          <AuthProvider>
            <UserProvider>
              <CssBaseline />
              <Router>
                <SignIn path="signin" />
                <Main path="*" />
              </Router>
            </UserProvider>
          </AuthProvider>
        </PickersProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

function PickersProvider({children}) {
  const [locale] = useLocale();
  return (
    <MuiPickersUtilsProvider
      utils={DateFnsUtils}
      locale={getLocaleData(locale)}
    >
      {children}
    </MuiPickersUtilsProvider>
  );
}
