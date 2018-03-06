import {store} from 'react-easy-state'

const initialCrates = {
  all: [],
}

export {initialCrates}

const crates = store({...initialCrates})

export default crates
