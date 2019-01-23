import uniq from 'lodash/uniq';
import bottlesStore from '../stores/bottlesStore';
import autocompletesStore from '../stores/autocompletesStore';
import storageApi from '../api/storageApi';
import {resize, blobify} from '../lib/image';
import {MAX_WIDTH} from '../form/ImageField';

export default async function(uid) {
  //   const path = `users/${uid}/etiquettes`;

  const autocompletesCollection = await autocompletesStore.collection();
  const bottlesCollection = await bottlesStore.collection();

  //   1 - For each bottle, recompute image autocomplete
  //   const bottlesSnapshot = await bottlesCollection.get();

  //   if (!bottlesSnapshot.empty) {
  //     const promises = bottlesSnapshot.docs
  //       .map(doc => ({
  //         ref: doc.ref,
  //         data: doc.data(),
  //       }))
  //       .filter(({data}) => data.image)
  //       .map(({ref, data}) => {
  //         data.etiquette = data.image;
  //         delete data.image;
  //         return ref.set(data);
  //       });
  //     console.log(promises.length)
  //     await Promise.all(promises);
  //   }
  //   return;
  // 1 - For each image autocompletes, get bottles count
  const autocompletesSnapshot = await (await autocompletesStore.collection())
    .where('namespace', '==', 'etiquette')
    .get();
  console.log(`autocompletes: ${autocompletesSnapshot.size}`);

  if (!autocompletesSnapshot.empty) {
    const promises = autocompletesSnapshot.docs.map(doc => doc.ref.delete());

    await Promise.all(promises);
console.log(promises.length)
    // 5 -
  }

  // load all bottles
  // for each bottle, recompute image autocomplete
  // load all image autocompletes
  // for each autocomplete, get bottles
  // for each autocomplete, if bottles, get storage ref, else delete ref
  // for each ref, get url
  // for each url, compute resize
  // for each new image, save in place
  // find a way to delete not found URL
}
