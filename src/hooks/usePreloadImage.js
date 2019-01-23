import {useState, useEffect} from 'react';

function usePreloadImage(url) {
  const [ready, setReady] = useState(false);

  function handleLoad() {
    setReady(true);
  }

  useEffect(
    () => {
      setReady(false);
      if (url) {
        const img = new Image();
        img.onload = handleLoad;
        img.src = url;

        return () => {
          img.src = '';
          img.onload = null;
        };
      }
    },
    [url]
  );

  return [ready];
}

export default usePreloadImage;
