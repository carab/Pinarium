import {useState, useEffect} from 'react';

import {getUrl} from '../api/storageApi';

function useFirebaseImage(path) {
  let mounted = true;
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    mounted = true;
    setUrl(null);
    setError(null);

    if (path) {
      const promise = getUrl(path);

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
  }, [path]);

  return [url, error];
}

export default useFirebaseImage;
