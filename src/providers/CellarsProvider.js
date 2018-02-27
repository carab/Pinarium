import React, {Component} from 'react'

import {onFetch} from '../api/cellarApi'
import cellars, {initialCellars} from '../stores/cellars'

export default class CellarsProvider extends Component {
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
      const cellar = doc.data()
      cellar.$ref = doc.ref
      data.push(cellar)
    })

    cellars.data = data
  }
}
