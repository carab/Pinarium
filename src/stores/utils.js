export async function subscribe(emitter, store) {
  if (!store.subscribers) {
    store.subscribers = 0
    store.unsubscribe = await emitter(snapshot => {
      snapshot.docChanges.forEach(function(change) {
        switch (change.type) {
          case 'added':
          case 'modified':
            const document = change.doc.data()
            document.$ref = change.doc.ref
            store.all[change.doc.ref.id] = document
            break

          case 'removed':
            delete store.all[change.doc.ref.id]
            break

          default:
        }
      })
    })
  }

  store.subscribers++
}

export function unsubscribe(store) {
  store.subscribers--

  if (!store.subscribers) {
    store.unsubscribe()
    delete store.unsubscribe
    delete store.subscribers
  }
}

export function save(saveData, data, id) {
  const {$ref, ...cleanedData} = data

  if (id) {
    return saveData(cleanedData, id)
  }

  if ($ref) {
    return saveData(cleanedData, $ref.id)
  }

  return saveData(cleanedData)
}
