import React, {Component} from 'react'

import {onRefreshCellars} from '../api/cellarApi'
import cellars, {initialCellars} from '../stores/cellars'

export default class CellarsProvider extends Component {
  componentDidMount() {
    this.unsubscribe = onRefreshCellars(this.handleFetch)
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
      const cellar = doc.data()
      cellar.$ref = doc.ref
      all.push(cellar)
    })

    cellars.all = all
  }
}
