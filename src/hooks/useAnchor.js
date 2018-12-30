import {useState} from 'react'

export default function useAnchor() {
  const [anchor, setAnchor] = useState(null)
  const open = Boolean(anchor)

  const handleOpen = event => {
    setAnchor(event.currentTarget)
  }

  const handleClose = event => {
    setAnchor(null)
  }

  return [anchor, open, handleOpen, handleClose]
}
