import {useState} from 'react'

export default function useToggable(initial = false) {
  const [open, setOpen] = useState(initial)

  const handleToggle = () => {
    setOpen(!open)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return [open, handleToggle, handleOpen, handleClose]
}
