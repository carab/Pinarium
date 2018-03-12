import React, {Component} from 'react'
import {store, view} from 'react-easy-state'

import etiquettesStore from '../../stores/etiquettesStore'
import bottlesStore from '../../stores/bottlesStore'
import cellarsStore from '../../stores/cellarsStore'

@view
export default class StoresProvider extends Component {
  static defaultProps = {
    Loading: null,
  }

  store = store({
    loading: true,
  })

  async componentDidMount() {
    bottlesStore.on()
    etiquettesStore.on()
    cellarsStore.on()

    this.store.loading = false
  }

  componentWillUnmount() {
    bottlesStore.off()
    etiquettesStore.off()
    cellarsStore.off()
  }

  render() {
    const {children, Loading} = this.props
    const {loading} = this.store

    if (loading) {
      return Loading
    }

    return children
  }
}
