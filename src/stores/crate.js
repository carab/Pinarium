import {store} from 'react-easy-state'

const initialCrate = {
  appellation: null,
  vintage: null,
  cuvee: null,
  producer: null,
  region: null,
  country: null,
  sort: null,
  effervescence: null,
  color: null,
  type: null,
  size: null,
  capsule: null,
  alcohol: null,
  medal: null,
  addedDate: null,
  cellar: null,
  reference: null,
  quantity: null,
  drankQuantity: null,
  procuredValue: null,
  procuredBy: null,
  procuredOn: null,
  procuredAt: null,
  procuredFrom: null,
  procuredTo: null,
  rating: null,
  notes: null,
  history: null,
}

const initialEntry = {
  quantity: null,
  cellar: null,
  when: null,
}

export {initialCrate, initialEntry}

const crate = store({...initialCrate})

export default crate
