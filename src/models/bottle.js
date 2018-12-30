export default {
  // Meta data
  hash: null,
  creationDate: null,
  updateDate: null,

  // Etiquette data
  sort: 'wine',
  vintage: null,
  appellation: null,
  bottlingDate: null,
  expirationDate: null,
  maxAge: null,
  cuvee: null,
  producer: null,
  region: null,
  country: null,
  size: null,
  color: null,
  effervescence: null,
  type: null,
  capsule: null,
  alcohol: null,
  medal: null,

  // data copied from last logs
  cellar: null,
  shelve: null,
  reference: null,
  status: null,
  value: null,
  rate: null,
  outDate: null,

  // History data
  logs: [],
}

export const autocompletes = [
  'appellation',
  'cuvee',
  'producer',
  'region',
  'country',
]
