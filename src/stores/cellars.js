import {store} from 'react-easy-state'

const initialCellars = {
  data: [],
}

export {initialCellars}

const cellars = store({...initialCellars})
export default cellars
