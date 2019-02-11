import {useState, useEffect, Ref} from 'react';

function useAutoresize(elementRef: Ref) {
  const [{width, height}, setMeasurements] = useState({width: 0, height: 0});
  const observer = new ResizeObserver(([{contentRect}]) => {
    setMeasurements({width: contentRect.width, height: contentRect.height});
  });

  useEffect(() => {
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [elementRef]);

  return [width, height];
}

export default useAutoresize;
