import React, {Component} from 'react'

import {onRefreshCrates} from '../api/crateApi'
import crates, {initialCrates} from '../stores/crates'

export default class CratesProvider extends Component {
  async componentDidMount() {
    this.unsubscribe = await onRefreshCrates(this.handleFetch)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {children} = this.props
    return children
  }

  handleFetch = snapshot => {
    const all = []
    snapshot.forEach(function(doc) {
      const crate = doc.data()
      crate.$ref = doc.ref
      all.push(crate)
    })

    crates.all = all
  }
}
