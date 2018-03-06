import {store} from 'react-easy-state'

const initialStatus = {
  connected: false,
}

export {initialStatus}

const status = store({...initialStatus})

export default status
