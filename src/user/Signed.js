import React, {Component} from 'react'
import {view} from 'react-easy-state'

import user from '../stores/user'

@view
export default class Signed extends Component {
  render() {
    const {off, children} = this.props

    if (off && false === user.signedIn) {
      return children
    }

    return null
  }
}
