import React, {Component, Fragment} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import {view} from 'react-easy-state'
import {withStyles} from 'material-ui/styles'

import StoresProvider from '../providers/StoresProvider'
import Fab from './Fab'
import Profile from '../user/Profile'
import BottleList from '../bottle/BottleList'
import BottleForm from '../bottle/BottleForm'
import BottleWizardForm from '../bottle/BottleWizardForm'
import EtiquetteList from '../etiquette/EtiquetteList'
import EtiquetteForm from '../etiquette/EtiquetteForm'
import LogList from '../log/LogList'
import LogForm from '../log/LogForm'
import CellarList from '../cellar/CellarList'
import CellarForm from '../cellar/CellarForm'

import user from '../../stores/user'

@withStyles(theme => ({
  root: {
    paddingBottom: theme.spacing.unit * 10,
  },
}))
@view
export default class Main extends Component {
  previousLocation = this.props.location

  componentWillUpdate(nextProps) {
    const {location} = this.props

    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = location
    }
  }

  render() {
    const {previousLocation} = this
    const {classes, location} = this.props
    const isModal = !!(
      location.state &&
      location.state.modal &&
      previousLocation !== location
    )

    if (!user.signedIn) {
      return <Redirect to="/signin" />
    }

    return (
      <div className={classes.root}>
        <StoresProvider>
          <Switch location={isModal ? previousLocation : location}>
            <Route path="/bottles" exact component={BottleList} />
            <Route path="/bottles/new" render={props => <BottleWizardForm />} />
            <Route
              path="/bottles/:id"
              render={props => <BottleForm id={props.match.params.id} />}
            />

            <Route path="/etiquettes" exact component={EtiquetteList} />
            <Route
              path="/etiquettes/:id"
              render={props => (
                <EtiquetteForm
                  id={
                    'new' === props.match.params.id
                      ? undefined
                      : props.match.params.id
                  }
                />
              )}
            />

            <Route path="/logs" exact component={LogList} />
            <Route
              path="/logs/:id"
              render={props => (
                <LogForm
                  id={
                    'new' === props.match.params.id
                      ? undefined
                      : props.match.params.id
                  }
                />
              )}
            />

            <Route path="/cellars" exact component={CellarList} />
            <Route
              path="/cellars/:id"
              render={props => (
                <CellarForm
                  id={
                    'new' === props.match.params.id
                      ? undefined
                      : props.match.params.id
                  }
                />
              )}
            />

            <Route path="/profile" exact component={Profile} />
          </Switch>
          {isModal ? (
            <Switch>
              <Route
                path="/bottles/new"
                render={props => <BottleWizardForm />}
              />
              <Route
                path="/bottles/:id"
                render={props => <BottleForm id={props.match.params.id} />}
              />

              <Route
                path="/etiquettes/:id"
                render={props => (
                  <EtiquetteForm
                    id={
                      'new' === props.match.params.id
                        ? undefined
                        : props.match.params.id
                    }
                  />
                )}
              />

              <Route
                path="/logs/:id"
                render={props => (
                  <LogForm
                    id={
                      'new' === props.match.params.id
                        ? undefined
                        : props.match.params.id
                    }
                  />
                )}
              />

              <Route
                path="/cellars/:id"
                render={props => (
                  <CellarForm
                    id={
                      'new' === props.match.params.id
                        ? undefined
                        : props.match.params.id
                    }
                  />
                )}
              />
            </Switch>
          ) : null}
          <Fab />
        </StoresProvider>
      </div>
    )
  }
}
