import React, {Component} from 'react'

import {onAuth, offAuth} from '../api/authApi'
import {fetchUser} from '../api/userApi'
import user, {initialUser} from '../stores/user'

export default class UserProvider extends Component {
  state = {
    fetched: false,
  }

  componentDidMount() {
    onAuth(this.handleAuth)
  }

  componentWillUnmount() {
    offAuth(this.handleAuth)
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
}
