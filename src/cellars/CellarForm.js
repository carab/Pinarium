import React, {useCallback} from 'react'
import {observer} from 'mobx-react-lite'
import {navigate} from '@reach/router'
import {makeStyles} from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import Container from '../ui/Container'
import FieldRow from '../form/FieldRow'
import TextField from '../form/TextField'
import cellarsStore, {useCellar} from '../stores/cellars'

export default observer(function CellarForm({id}) {
  const cellar = useCellar(id)

  if (null === cellar) {
    return 'loading'
  }

  const handleSave = () => {
    cellarsStore.save(cellar)
  }

  return (
    <Form title={id ? 'Edit' : 'New'} cellar={cellar} onSave={handleSave} />
  )
})

const useStyles = makeStyles(theme => ({
  name: {
    flexBasis: '200px',
  },
  description: {
    width: '100%',
  },
}))

const Form = observer(function({title, cellar, onSave}) {
  const errors = {}

  const classes = useStyles()

  const handleChange = useCallback((value, name) => {
    cellar[name] = value
  }, [])

  const handleSubmit = useCallback(async event => {
    event.preventDefault()

    try {
      await onSave()
      navigate('/cellars')
    } catch (error) {
      console.error(error)
    }
  }, [])

  return (
    <Container
      size="sm"
      title={title}
      actions={
        <Button type="submit" variant="contained" color="secondary">
          Save
        </Button>
      }
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
    >
      <FieldRow>
        <TextField
          label="Name"
          name="name"
          required={true}
          value={cellar.name}
          onChange={handleChange}
          //error={null !== errors.name}
          helperText={errors.name}
          className={classes.name}
        />
      </FieldRow>
      <FieldRow>
        <TextField
          label="Description"
          name="description"
          value={cellar.description}
          onChange={handleChange}
          className={classes.description}
        />
      </FieldRow>
    </Container>
  )
})
