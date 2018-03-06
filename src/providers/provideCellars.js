import React, {Component} from 'react'

import {onRefreshCellars} from '../api/cellarApi'
import cellars, {initialCellars} from '../stores/cellars'

export default function provideCellars(WrappedComponent) {
  return class CellarsProvider extends Component {
    async componentDidMount() {
      this.unsubscribe = await onRefreshCellars(this.handleFetch)
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    render() {
      return <WrappedComponent {...this.props} />
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
}
