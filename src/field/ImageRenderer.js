import React, {useEffect, useState} from 'react'

import storageApi from '../api/storageApi'

function ImageRenderer({value, name, ...props}) {
  const [src, setSrc] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(
    () => {
      setLoading(true)
      storageApi
        .child(value)
        .getDownloadURL()
        .then(url => {
          setLoading(false)
          setSrc(url)
        })
    },
    [value]
  )

  if (src) {
    return <img src={src} alt={value} {...props} />
  }

  return null
}

export default ImageRenderer
