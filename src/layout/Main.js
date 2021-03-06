import React from 'react';
import {Router, Redirect} from '@reach/router';
import {observer} from 'mobx-react-lite';
import {makeStyles} from '@material-ui/styles';

import Topbar from './Topbar';
import Sidebar from './Sidebar';
import Fab from './Fab';
import BottleList from '../bottles/BottlePage';
import BottleForm from '../bottles/BottleForm';
import BottleDeleteDialog from '../bottles/BottleDeleteDialog';
import BottleUpdateDialog from '../bottles/BottleUpdateDialog';
import CellarList from '../cellars/CellarList';
import CellarForm from '../cellars/CellarForm';
import UserSettings from '../user/UserSettings';
import SearchDrawer from '../search/SearchDrawer';

import auth from '../stores/auth';
import {useBottles} from '../stores/bottlesStore';
import {useCellars} from '../stores/cellarsStore';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  spacer: theme.mixins.toolbar,
  main: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 3,
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      // flexGrow: 0,
    },
  },
}));

export default observer(function Main() {
  // Preload these as they will be loaded anyway later
  useBottles();
  useCellars();

  if (null === auth.user) {
    return <Redirect to="/signin" noThrow />;
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Topbar />
      <Sidebar />
      <Fab />
      <main className={classes.main}>
        <div className={classes.spacer} />
        <Router className={classes.content}>
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
      <SearchDrawer />
      <BottleDeleteDialog />
      <BottleUpdateDialog />
    </div>
  );
});
