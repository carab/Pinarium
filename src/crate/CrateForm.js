import React, {Component, Fragment} from 'react'
import {Redirect} from 'react-router-dom'
import {store, view} from 'react-easy-state'
import {withStyles} from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import Tabs, {Tab} from 'material-ui/Tabs'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import {CircularProgress} from 'material-ui/Progress'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog'
import Menu, {MenuItem} from 'material-ui/Menu'
import {ListItemIcon, ListItemText} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import DeleteIcon from 'material-ui-icons/Delete'
import RemoveCircleOutlineIcon from 'material-ui-icons/RemoveCircleOutline'
import AddCircleOutlineIcon from 'material-ui-icons/AddCircleOutline'

import DateField from '../form/DateField'
import SelectField from '../form/SelectField'
import TextField from '../form/TextField'

import {fetchCrate, saveCrate} from '../api/crateApi'
import cellars from '../stores/cellars'
import {initialCrate, initialEntry} from '../stores/crate'

import colors from '../enums/colors'
import effervescences from '../enums/effervescences'
import procurements from '../enums/procurements'
import ratings from '../enums/ratings'
import sizes from '../enums/sizes'
import sorts from '../enums/sorts'

@withMobileDialog()
@withStyles(theme => ({
  input: {
    margin: theme.spacing.unit,
  },
  inputSmall: {
    flexBasis: '75px',
  },
  inputNormal: {
    flexBasis: '150px',
    flexGrow: '1',
  },
  inputLarge: {
    flexBasis: '250px',
    flexGrow: '1',
  },
  inputFull: {
    width: '100%',
  },
  button: {
    margin: theme.spacing.unit,
  },
  content: {
    padding: 0,
  },
  title: {
    padding: 0,
  },
  progress: {
    margin: theme.spacing.unit * 2,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
  },
}))
@view
export default class CrateForm extends Component {
  store = store({
    crate: {...initialCrate},
  })

  state = {
    open: true,
    exit: false,
    loading: Boolean(this.props.id),
    saving: false,
    tab: 0,
    errors: {
      sort: null,
      appellation: null,
      cellar: null,
    },
    validation: {
      sort: false,
      appellation: false,
      cellar: false,
      form: false,
    },
  }

  async componentDidMount() {
    const {id} = this.props
    if (id) {
      this.store.crate = await fetchCrate(id)
      this.validate()
      this.setState({loading: false})
    }
  }

  render() {
    const {tab, open, exit, loading, saving, validation, errors} = this.state
    const {classes, fullScreen, id} = this.props
    const {crate} = this.store

    if (exit) {
      return <Redirect to="/crates" />
    }

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="form-dialog-title"
        onClose={this.handleClose}
        onExited={this.handleExit}
      >
        <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
          <DialogTitle id="form-dialog-title" className={classes.title}>
            <AppBar position="static">
              <Toolbar>{id ? 'Edit a crate' : 'Add a crate'}</Toolbar>
            </AppBar>
          </DialogTitle>
          <DialogContent className={classes.content}>
            <Typography align="center" color="error">
              {errors.form}
            </Typography>
            <AppBar position="static" color="default">
              <Tabs
                value={tab}
                onChange={this.handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                fullWidth
              >
                <Tab label="Etiquette" />
                <Tab label="History" />
              </Tabs>
            </AppBar>
            {loading ? (
              <CircularProgress className={classes.progress} />
            ) : (
              tab === 0 && (
                <TabContainer>
                  <FormRow>
                    <SelectField
                      label="Sort"
                      value={crate.sort}
                      onChange={this.handleFieldChange('sort')}
                      className={classes.input + ' ' + classes.inputNormal}
                      error={null !== errors.sort}
                      helperText={errors.sort}
                      options={Object.keys(sorts).map(sort => ({
                        value: sort,
                        label: sort,
                      }))}
                    />
                    <TextField
                      label="Appellation"
                      name="appellation"
                      value={crate.appellation}
                      onChange={this.handleFieldChange('appellation')}
                      className={classes.input + ' ' + classes.inputLarge}
                      error={null !== errors.appellation}
                      helperText={errors.appellation}
                    />
                    <TextField
                      label="Vintage"
                      name="vintage"
                      value={crate.vintage}
                      onChange={this.handleFieldChange('vintage')}
                      className={classes.input + ' ' + classes.inputSmall}
                    />
                    <TextField
                      label="Cuvée"
                      name="cuvee"
                      value={crate.cuvee}
                      onChange={this.handleFieldChange('cuvee')}
                      className={classes.input + ' ' + classes.inputNormal}
                    />
                  </FormRow>
                  <FormRow>
                    <TextField
                      label="Producer"
                      name="producer"
                      value={crate.producer}
                      onChange={this.handleFieldChange('producer')}
                      className={classes.input + ' ' + classes.inputNormal}
                    />
                    <TextField
                      label="Region"
                      name="region"
                      value={crate.region}
                      onChange={this.handleFieldChange('region')}
                      className={classes.input + ' ' + classes.inputNormal}
                    />
                    <TextField
                      label="Country"
                      name="country"
                      value={crate.country}
                      onChange={this.handleFieldChange('country')}
                      className={classes.input + ' ' + classes.inputNormal}
                    />
                  </FormRow>
                  <FormRow>
                    <SelectField
                      label="Color"
                      value={crate.color}
                      onChange={this.handleFieldChange('color')}
                      className={classes.input + ' ' + classes.inputNormal}
                      emptyLabel={<em>None</em>}
                      options={colors.map(color => ({
                        value: color,
                        label: color,
                      }))}
                    />
                    <SelectField
                      label="Effervescence"
                      value={crate.effervescence}
                      onChange={this.handleFieldChange('effervescence')}
                      className={classes.input + ' ' + classes.inputNormal}
                      emptyLabel={<em>None</em>}
                      options={effervescences.map(effervescence => ({
                        value: effervescence,
                        label: effervescence,
                      }))}
                    />
                    {crate.sort && sorts[crate.sort] ? (
                      <SelectField
                        label="Type"
                        value={crate.type}
                        onChange={this.handleFieldChange('type')}
                        className={classes.input + ' ' + classes.inputNormal}
                        emptyLabel={<em>None</em>}
                        options={sorts[crate.sort].types.map(type => ({
                          value: type,
                          label: type,
                        }))}
                      />
                    ) : null}
                    <SelectField
                      label="Size"
                      value={crate.size}
                      onChange={this.handleFieldChange('size')}
                      className={classes.input + ' ' + classes.inputNormal}
                      emptyLabel={<em>None</em>}
                      options={sizes.map(size => ({value: size, label: size}))}
                    />
                  </FormRow>
                  <FormRow>
                    <TextField
                      label="Capsule"
                      name="capsule"
                      value={crate.capsule}
                      onChange={this.handleFieldChange('capsule')}
                      className={classes.input + ' ' + classes.inputSmall}
                    />
                    <TextField
                      type="number"
                      label="Alcohol"
                      name="alcohol"
                      value={crate.alcohol}
                      onChange={this.handleFieldChange('alcohol')}
                      className={classes.input + ' ' + classes.inputSmall}
                    />
                    <TextField
                      label="Medal/Prize"
                      name="medal"
                      value={crate.medal}
                      onChange={this.handleFieldChange('medal')}
                      className={classes.input + ' ' + classes.inputNormal}
                    />
                  </FormRow>
                </TabContainer>
              )
            )}
            {tab === 1 && (
              <TabContainer>
                <div style={{textAlign: 'center'}}>
                  <Button
                    className={classes.button}
                    onClick={this.handleAddEntry}
                  >
                    Add an entry
                  </Button>
                </div>
                {Array.isArray(crate.history)
                  ? crate.history.map((entry, i) => (
                      <Fragment key={i}>
                        <Divider />
                        <EntryForm
                          entry={entry}
                          onDelete={this.handleDeleteEntry(i)}
                        />
                      </Fragment>
                    ))
                  : null}
              </TabContainer>
            )}
          </DialogContent>
          {saving ? (
            <DialogActions>
              <CircularProgress className={classes.button} />
            </DialogActions>
          ) : (
            <DialogActions>
              <Button className={classes.button} onClick={this.handleClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                className={classes.button}
                disabled={!validation.form}
              >
                Save
              </Button>
            </DialogActions>
          )}
        </form>
      </Dialog>
    )
  }

  handleAddEntry = event => {
    const {crate} = this.store

    if (!Array.isArray(crate.history)) {
      crate.history = []
    }

    crate.history.push({...initialEntry})
  }

  handleDeleteEntry = i => event => {
    const {crate} = this.store

    if (Array.isArray(crate.history)) {
      crate.history.splice(i, 1)
    }
  }

  handleClose = () => {
    this.setState({open: false})
  }

  handleExit = () => {
    this.setState({exit: true})
  }

  handleTabChange = (event, tab) => {
    this.setState({tab})
  }

  handleFieldChange = name => value => {
    this.store.crate[name] = value
    this.validateField(name, value)
  }

  handleSubmit = async event => {
    event.preventDefault()

    const {validation, errors} = this.state

    if (validation.form) {
      this.setState({saving: true})
      const {crate} = this.store

      try {
        const {id} = this.props
        console.log(crate)
        await saveCrate(crate, id)

        this.handleClose()
      } catch (error) {
        errors.form = error.message
        this.setState({
          errors,
          saving: false,
        })
      }
    }
  }

  validate() {
    const {validation} = this.state
    const {crate} = this.store

    Object.keys(crate).forEach(name => {
      if (undefined !== validation[name]) {
        this.validateField(name, crate[name])
      }
    })
  }

  validateField(name, value) {
    const {errors, validation} = this.state
    let error = null

    switch (name) {
      case 'appellation':
        error = value.length > 0 ? null : 'Please enter an appellation'
        break
      case 'sort':
        error = value.length > 0 ? null : 'Please select a sort'
        break
      case 'cellar':
        error =
          value && typeof value === 'object' ? null : 'Please select a cellar'
        break
      default:
        break
    }

    errors[name] = error
    validation[name] = null === error

    this.setState(
      {
        errors,
        validation,
      },
      this.validateForm
    )
  }

  validateForm() {
    const {validation} = this.state
    validation.form =
      validation.sort && validation.appellation && validation.cellar

    this.setState({
      validation,
    })
  }
}

@withStyles(theme => ({
  root: {
    padding: theme.spacing.unit,
  },
}))
class TabContainer extends Component {
  render() {
    const {children, classes} = this.props
    return <div className={classes.root}>{children}</div>
  }
}

@withStyles(theme => ({
  root: {
    padding: theme.spacing.unit * 2,
    display: 'flex',
    flexWrap: 'wrap',
  },
}))
class FormRow extends Component {
  render() {
    const {children, classes} = this.props
    return <div className={classes.root}>{children}</div>
  }
}

@view
class EntryForm extends Component {
  state = {
    anchorEl: null,
  }

  handleChange = name => value => {
    const {entry} = this.props
    entry[name] = value
  }

  handleRemove = name => event => {
    const {entry} = this.props
    delete entry[name]
  }

  handleAdd = name => event => {
    const {entry} = this.props
    entry[name] = null
    this.handleClose()
  }

  handleOpen = event => {
    this.setState({anchorEl: event.currentTarget})
  }

  handleClose = () => {
    this.setState({anchorEl: null})
  }

  render() {
    const {entry, onDelete} = this.props
    const {anchorEl} = this.state
    const open = Boolean(anchorEl)

    return (
      <div>
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
        <IconButton
          aria-owns={open ? 'crate-history-entry-fields-menu' : null}
          aria-haspopup="true"
          onClick={this.handleOpen}
        >
          <AddCircleOutlineIcon />
        </IconButton>
        <Menu
          id="crate-history-entry-fields-menu"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={this.handleClose}
        >
          {Object.keys(this.constructor.fields).map(
            name =>
              undefined === entry[name] ? (
                <MenuItem key={name} onClick={this.handleAdd(name)}>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </MenuItem>
              ) : null
          )}
        </Menu>
        {Object.keys(entry).map(name => this.renderField(name, entry[name]))}
      </div>
    )
  }

  static fields = {
    quantity: {
      required: true,
      component: TextField,
      props: () => ({type: 'number'}),
    },
    cellar: {
      required: true,
      component: SelectField,
      props: () => ({
        options: cellars.data,
        labelAccessor: 'title',
        keyAccessor: 'id',
        valueAccessor: '$ref',
      }),
    },
    when: {
      required: true,
      component: DateField,
    },
    how: {
      component: SelectField,
    },
    where: {
      component: TextField,
    },
    who: {
      component: TextField,
    },
    reference: {
      component: TextField,
    },
    rate: {
      component: SelectField,
      props: () => ({
        options: ratings.map(rating => ({
          value: rating,
          label: rating,
        })),
      }),
    },
    comment: {
      component: TextField,
      props: () => ({multiLine: true}),
    },
    value: {
      component: TextField,
      props: () => ({type: 'number'}),
    },
  }

  renderField(name, value) {
    const field = this.constructor.fields[name]

    if (undefined === field) {
      return null
    }

    const props = field.props ? field.props() : undefined

    return (
      <div key={name} className="">
        <field.component
          {...props}
          label={name}
          value={value}
          onChange={this.handleChange(name)}
        />
        {field.required ? null : (
          <IconButton onClick={this.handleRemove(name)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        )}
      </div>
    )
  }
}
