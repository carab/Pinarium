import {store} from 'react-easy-state'

const initialCrates = {
  data: [],
}

export {initialCrates}

const crates = store({...initialCrates})

export default crates
