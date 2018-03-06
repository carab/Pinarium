import React, {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import {view} from 'react-easy-state'

import Fab from '../layout/Fab'
import Profile from '../user/Profile'
import CellarList from '../cellar/CellarList'
import CrateList from '../crate/CrateList'
import CrateForm from '../crate/CrateForm'
import CellarsProvider from '../providers/CellarsProvider'
import CratesProvider from '../providers/CratesProvider'

import user from '../stores/user'

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
    const {location} = this.props
    const isModal = !!(
      location.state &&
      location.state.modal &&
      previousLocation !== location
    )

    if (!user.signedIn) {
      return <Redirect to="/signin" />
    }

    return (
      <CratesProvider>
        <Switch location={isModal ? previousLocation : location}>
          <Route
            path="/crates/edit/:id"
            render={props => <CrateForm id={props.match.params.id} />}
          />
          <Route path="/crates/new" component={CrateForm} />
          <Route path="/crates" component={CrateList} />
          <Route path="/profile" component={Profile} />
          <Route path="/" component={CellarList} />
        </Switch>
        {isModal ? (
          <Switch>
            <Route
              path="/crates/edit/:id"
              render={props => <CrateForm id={props.match.params.id} />}
            />
            <Route path="/crates/new" component={CrateForm} />
          </Switch>
        ) : null}
        <Fab />
      </CratesProvider>
    )
  }
}
