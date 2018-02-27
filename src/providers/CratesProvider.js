import React, {Component} from 'react'

import {onFetch} from '../api/crateApi'
import crates, {initialCrates} from '../stores/crates'

export default class CratesProvider extends Component {
  componentDidMount() {
    this.unsubscribe = onFetch(this.handleFetch)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {children} = this.props
    return children
  }

  handleFetch = snapshot => {
    const data = []
    snapshot.forEach(function(doc) {
      const crate = doc.data()
      crate.$ref = doc.ref
      data.push(crate)
    })

    crates.data = data
  }
}
