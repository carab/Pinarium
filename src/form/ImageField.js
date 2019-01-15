import React, {useState, useEffect} from 'react'
import {useTranslation} from 'react-i18next/hooks'
import {makeStyles} from '@material-ui/styles'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'

import {AddImageIcon} from '../ui/Icons'

import storageApi from '../api/storageApi'

export default function FileField({
  id,
  label,
  value,
  accept,
  name,
  onChange,
  InputLabelProps,
  InputProps,
  inputProps,
  ...props
}) {
  const [t] = useTranslation()

  function handleChange(event) {
    const {files} = event.target

    if (onChange) {
      onChange(files[0], name)
    }
  }

  const title = t('form.image.upload')

  return (
    <TextField
      label={label}
      id={id}
      onChange={handleChange}
      type="file"
      InputLabelProps={{
        shrink: true,
        ...InputLabelProps,
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              component="label"
              htmlFor={id}
              aria-label={title}
              title={title}
            >
              <AddImageIcon />
            </IconButton>
          </InputAdornment>
        ),
        inputComponent: ImageInput,
        ...InputProps,
      }}
      inputProps={{
        accept: accept,
        value: value,
        label: label,
        // onChange: handleChange,
        ...inputProps,
      }}
      {...props}
    />
  )
}

const useStyle = makeStyles(theme => ({
  input: {
    display: 'none',
  },
  label: {
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    textAlign: 'right',
    minHeight: '1.1875em',
    height: 'auto',
  },
  image: {
    maxWidth: '16em',
  },
  progress: {
    //margin: theme.spacing.unit,
  },
}))

function ImageInput({
  accept,
  value,
  label,
  className,
  inputRef,
  onChange,
  ...props
}) {
  const [src, setSrc] = useState(null)
  const [loading, setLoading] = useState(false)

  const classes = useStyle()

  useEffect(
    () => {
      if (value instanceof File) {
        setLoading(true)
        var reader = new FileReader()

        reader.onload = event => {
          setLoading(false)
          setSrc(event.target.result)
        }

        reader.readAsDataURL(value)
      } else if (value) {
        setLoading(true)
        storageApi
          .child(value)
          .getDownloadURL()
          .then(url => {
            setLoading(false)
            setSrc(url)
          })
      }
    },
    [value]
  )

  return (
    <label className={classes.label + ' ' + className}>
      <input
        type="file"
        accept={accept}
        className={classes.input}
        id="image-field"
        onChange={onChange}
        ref={inputRef}
        {...props}
      />
      {/* {loading ? <CircularProgress className={classes.progress} /> : null} */}
      {src ? <img className={classes.image} src={src} alt={label} /> : null}
    </label>
  )
}
