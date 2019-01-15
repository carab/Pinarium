import React, {useState} from 'react'
import TextField from './TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

import {UploadIcon} from '../ui/Icons'

export default function FileField({
  value,
  name,
  multiple,
  accept,
  onChange,
  ...props
}) {
  const [filename, setFilename] = useState(null)

  function handleChange(event) {
    const {value, files} = event.target
    setFilename(value.split(/(\\|\/)/g).pop())

    if (onChange) {
      onChange(multiple ? files : files[0], name)
    }
  }

  return (
    <>
      <input
        multiple={multiple}
        accept={accept}
        type="file"
        // className={classes.input}
        id="flat-button-file"
        onChange={handleChange}
      />
      {/* <label htmlFor="flat-button-file">
        <Button component="span" className={classes.button}>
          Upload
        </Button>
      </label> */}
      <TextField
        readOnly
        value={filename}
        {...props}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <UploadIcon />
            </InputAdornment>
          ),
        }}
      />
    </>
  )
}
