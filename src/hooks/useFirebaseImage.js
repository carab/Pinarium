import {useState, useEffect} from 'react';

import storageApi from '../api/storageApi';

function useFirebaseImage(reference) {
  let mounted = true;
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(
    () => {
      mounted = true;
      setUrl(null);
      setError(null);

      if (reference) {
        const promise = storageApi.child(reference).getDownloadURL();

        promise
          .then(url => {
            if (mounted) {
              setUrl(url);
            }
          })
          .catch(error => {
            if (mounted) {
              setError(error);
            }
          });

        return () => {
          mounted = false;
        };
      }
    },
    [reference]
  );

  return [url, error];
}

export default useFirebaseImage;
