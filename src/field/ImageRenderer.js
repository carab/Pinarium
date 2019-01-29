import React from 'react';

import useFirebaseImage from '../hooks/useFirebaseImage';

function ImageRenderer({value, name, ...props}) {
  const [src] = useFirebaseImage(value);

  if (src) {
    return <img src={src} alt={value} {...props} />;
  }

  return null;
}

export default ImageRenderer;
