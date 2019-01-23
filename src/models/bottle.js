import uid from '../lib/uid'

export default {
  // Meta data
  hash: uid(),
  creationDate: null,
  updateDate: null,

  // Etiquette data
  etiquette: null,
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
  organic: null,
  comment: null,

  // data copied from last logs
  stocked: true,
  cellar: null,
  shelve: null,
  reference: null,
  status: null,
  rating: null,
  inDate: null,
  outDate: null,
  buyingPrice: null,
  sellingPrice: null,

  // History data
  logs: [],
}
