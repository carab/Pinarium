import {store} from 'react-easy-state'

const initialCellars = {
  all: [],
}

export {initialCellars}

const cellars = store({...initialCellars})
export default cellars
