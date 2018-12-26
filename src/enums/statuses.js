export default [
  {
    name: 'received',
    fields: ['when', 'who', 'where', 'why', 'cellar', 'comment'],
    next: ['picked', 'drank', 'moved', 'given', 'sold'],
  },
  {
    name: 'bought',
    fields: ['when', 'who', 'where', 'why', 'cellar', 'value', 'comment'],
    next: ['picked', 'drank', 'moved', 'given', 'sold'],
  },
  {
    name: 'picked',
    fields: ['when', 'where', 'why', 'comment'],
    next: ['unpicked', 'drank'],
  },
  {
    name: 'unpicked',
    fields: ['when', 'comment'],
    next: ['picked', 'drank', 'moved', 'given', 'sold'],
  },
  {
    name: 'moved',
    fields: ['when', 'why', 'from', 'cellar', 'comment'],
    next: ['picked', 'drank', 'moved', 'given', 'sold'],
  },
  {
    name: 'given',
    fields: ['when', 'who', 'where', 'why', 'comment'],
    next: ['received', 'bought', 'drank'],
  },
  {
    name: 'sold',
    fields: ['when', 'who', 'where', 'why', 'value', 'comment'],
    next: ['received', 'bought', 'drank'],
  },
  {
    name: 'drank',
    fields: ['when', 'where', 'why', 'rate', 'comment'],
    next: [],
  },
]

// Gift from [Jules] on [02/01/2018] in [Lyon] for [Camille's birthday]
// Gift to [Jules] on [02/01/2018] in [Lyon] for [Camille's birthday]
// Bought on [02/01/2018] in [Lyon] for [10 €]
// Sold on [02/01/2018] in [Lyon] for [10 €]
// Drank on [02/01/2018] in [Lyon] for [Camille's birthday], rated [5 stars]
// Moved on [02/01/2018] from [Cave Tupin/2/A3] to [Cave Tupin/1/D2]
// Picked on [02/01/2018]
// Re-stashed on [02/01/2018]
