import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {view} from 'react-easy-state'

import {signOut} from '../api/authApi'
import user from '../stores/user'

@view
export default class SignOut extends Component {
  componentDidMount() {
    signOut()
  }

  render() {
    if (user.signedIn) {
      return null
    }

    return <Redirect to="/" />
  }
}
