import React, {Component} from 'react'

import {onAuth} from '../api/authApi'
import {onStatusChange} from '../api/statusApi'
import {fetchUser} from '../api/userApi'

import user, {initialUser} from '../stores/user'
import status, {initialStatus} from '../stores/status'

export default class UserProvider extends Component {
  state = {
    fetched: false,
  }

  componentDidMount() {
    this.unsubscribeAuth = onAuth(this.handleAuth)
    this.unsubscribeStatus = onStatusChange(this.handleStatusChange)
  }

  componentWillUnmount() {
    this.unsubscribeAuth()
    this.unsubscribeStatus()
  }

  render() {
    const {fetched} = this.state
    const {children} = this.props

    if (fetched) {
      return children
    }

    return null
  }

  handleAuth = async userInfo => {
    if (userInfo) {
      user.info = userInfo
      user.data = await fetchUser()
      user.signedIn = true
    } else {
      user.signedIn = initialUser.signedIn
      user.data = initialUser.data
      user.info = initialUser.info
    }

    this.setState({
      fetched: true,
    })
  }

  handleStatusChange = connected => {
    status.connected = connected
  }
}
