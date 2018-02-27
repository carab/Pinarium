import {store} from 'react-easy-state'

const initialUser = {
  signedIn: false,
  info: {},
  data: {},
}

export {initialUser}

const user = store({...initialUser})

export default user
