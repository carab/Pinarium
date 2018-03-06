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
import {InputAdornment} from 'material-ui/Input'
import DeleteIcon from 'material-ui-icons/Delete'
import RemoveCircleOutlineIcon from 'material-ui-icons/RemoveCircleOutline'
import AddCircleOutlineIcon from 'material-ui-icons/AddCircleOutline'
import ShoppingCartIcon from 'material-ui-icons/ShoppingCart'
import RoomIcon from 'material-ui-icons/Room'
import PersonIcon from 'material-ui-icons/Person'
import StarIcon from 'material-ui-icons/Star'
import AttachMoneyIcon from 'material-ui-icons/AttachMoney'
import CommentIcon from 'material-ui-icons/Comment'
import SwapHorizIcon from 'material-ui-icons/SwapHoriz'
import LayersIcon from 'material-ui-icons/Layers'
import GridOnIcon from 'material-ui-icons/GridOn'

import DateField from '../form/DateField'
import SelectField from '../form/SelectField'
import TextField from '../form/TextField'
import ArrayField from '../form/ArrayField'

import {fetchCrate, saveCrate} from '../api/crateApi'
import cellars from '../stores/cellars'
import status from '../stores/status'
import {initialCrate, initialEntry} from '../stores/crate'

import colors from '../enums/colors'
import effervescences from '../enums/effervescences'
import procurements from '../enums/procurements'
import ratings from '../enums/ratings'
import sizes from '../enums/sizes'
import sorts from '../enums/sorts'

@withMobileDialog()
@withStyles(theme => ({
  inputXS: {
    margin: theme.spacing.unit,
    flexBasis: '75px',
  },
  inputMD: {
    margin: theme.spacing.unit,
    flexBasis: '150px',
    flexGrow: '1',
  },
  inputLG: {
    margin: theme.spacing.unit,
    flexBasis: '250px',
    flexGrow: '1',
  },
  inputXL: {
    margin: theme.spacing.unit,
    width: '100%',
  },
  button: {
    margin: theme.spacing.unit,
  },
  saveButtonWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  saveButtonLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  content: {
    padding: 0,
  },
  title: {
    padding: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
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
    },
    validation: {
      sort: false,
      appellation: false,
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
        <form
          className={classes.form}
          onSubmit={this.handleSubmit}
          noValidate
          autoComplete="off"
        >
          <DialogTitle id="form-dialog-title" className={classes.title}>
            <AppBar position="static">
              <Toolbar>{id ? 'Edit a crate' : 'Add a crate'}</Toolbar>
            </AppBar>
            {loading ? null : (
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
            )}
          </DialogTitle>
          <DialogContent className={classes.content}>
            <Typography align="center" color="error">
              {errors.form}
            </Typography>
            {loading ? (
              <CircularProgress className={classes.progress} />
            ) : (
              <Fragment>
                {tab === 0 && this.renderEtiquette()}
                {tab === 1 && this.renderHistory()}
              </Fragment>
            )}
          </DialogContent>
          {loading ? null : (
            <DialogActions>
              <Fragment>
                <Button className={classes.button} onClick={this.handleClose}>
                  Cancel
                </Button>
                <div className={classes.saveButtonWrapper}>
                  <Button
                    color="primary"
                    type="submit"
                    className={classes.button}
                    disabled={!validation.form || saving}
                  >
                    {saving ? '' : 'Save'}
                  </Button>
                  {saving ? (
                    <CircularProgress
                      size={24}
                      className={classes.saveButtonLoader}
                    />
                  ) : null}
                </div>
              </Fragment>
            </DialogActions>
          )}
        </form>
      </Dialog>
    )
  }

  renderEtiquette() {
    const {classes} = this.props
    const {errors} = this.state
    const {crate} = this.store

    return (
      <TabContainer>
        <FormRow>
          <SelectField
            label="Sort"
            value={crate.sort}
            onChange={this.handleFieldChange('sort')}
            className={classes.inputMD}
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
            className={classes.inputLG}
            error={null !== errors.appellation}
            helperText={errors.appellation}
          />
          <TextField
            label="Vintage"
            name="vintage"
            value={crate.vintage}
            onChange={this.handleFieldChange('vintage')}
            className={classes.inputXS}
          />
          <TextField
            label="Cuvée"
            name="cuvee"
            value={crate.cuvee}
            onChange={this.handleFieldChange('cuvee')}
            className={classes.inputMD}
          />
        </FormRow>
        <FormRow>
          <TextField
            label="Producer"
            name="producer"
            value={crate.producer}
            onChange={this.handleFieldChange('producer')}
            className={classes.inputMD}
          />
          <TextField
            label="Region"
            name="region"
            value={crate.region}
            onChange={this.handleFieldChange('region')}
            className={classes.inputMD}
          />
          <TextField
            label="Country"
            name="country"
            value={crate.country}
            onChange={this.handleFieldChange('country')}
            className={classes.inputMD}
          />
        </FormRow>
        <FormRow>
          <SelectField
            label="Color"
            value={crate.color}
            onChange={this.handleFieldChange('color')}
            className={classes.inputMD}
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
            className={classes.inputMD}
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
              className={classes.inputMD}
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
            className={classes.inputMD}
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
            className={classes.inputXS}
          />
          <TextField
            type="number"
            label="Alcohol"
            name="alcohol"
            value={crate.alcohol}
            onChange={this.handleFieldChange('alcohol')}
            className={classes.inputXS}
          />
          <TextField
            label="Medal/Prize"
            name="medal"
            value={crate.medal}
            onChange={this.handleFieldChange('medal')}
            className={classes.inputMD}
          />
        </FormRow>
      </TabContainer>
    )
  }

  renderHistory() {
    const {classes} = this.props
    const {crate} = this.store

    const history = Array.isArray(crate.history) ? crate.history : []

    history.sort((a, b) => {
      const A = a.when.getTime()
      const B = b.when.getTime()
      if (A > B) return 1
      if (A < B) return -1
      return 0
    })

    return (
      <TabContainer>
        <div style={{textAlign: 'center'}}>
          <Button className={classes.button} onClick={this.handleAddEntry}>
            New entry
          </Button>
        </div>
        {history.map((entry, i) => (
          <Fragment key={i}>
            <Divider />
            <EntryForm entry={entry} onDelete={this.handleDeleteEntry(i)} />
          </Fragment>
        ))}
      </TabContainer>
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
      const {id} = this.props
      
      if (status.connected) {
        try {
          await saveCrate(crate, id)
          this.handleClose()
        } catch (error) {
          errors.form = error.message
          this.setState({
            errors,
            saving: false,
          })
        }
      } else {
        saveCrate(crate, id)
        this.handleClose()
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
    validation.form = validation.sort && validation.appellation

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

@withStyles(theme => ({
  root: {
    padding: theme.spacing.unit / 2,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  fields: {
    paddingLeft: theme.spacing.unit * 4,
  },
  field: {
    display: 'flex',
    alignItems: 'flex-start',
    margin: theme.spacing.unit / 2,
  },
  icon: {
    marginBottom: theme.spacing.unit / 2,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2 / 3,
  },
  adornment: {
    width: 'auto',
    height: 'auto',
    padding: theme.spacing.unit / 2,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit / 3,
  },
  inputXS: {
    width: '50px',
  },
  inputSM: {
    flexBasis: '125px',
  },
  inputMD: {
    flexBasis: '150px',
  },
  inputLG: {
    flexBasis: '250px',
  },
  inputXL: {
    flexGrow: 1,
  },
}))
@view
class EntryForm extends Component {
  state = {
    anchorEl: null,
  }

  handleChange = name => value => {
    const {entry} = this.props
    console.log('handleChange', value)
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

  handleDelete = () => {
    const {onDelete} = this.props
    this.handleClose()
    onDelete()
  }

  render() {
    const {classes, entry} = this.props
    const {anchorEl} = this.state
    const open = Boolean(anchorEl)

    const fields = this.constructor.fields
    const names = Object.keys(fields)

    const availableFields = names.filter(name => undefined === entry[name])
    const requiredFields = names.filter(name => fields[name].required)
    const presentFields = names.filter(
      name => !fields[name].required && undefined !== entry[name]
    )

    return (
      <div className={classes.root}>
        <div className={classes.header}>
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
            open={open}
            onClose={this.handleClose}
          >
            {availableFields.map(name => {
              const field = fields[name]

              return (
                <MenuItem key={name} onClick={this.handleAdd(name)}>
                  {field.icon ? (
                    <ListItemIcon>
                      <field.icon />
                    </ListItemIcon>
                  ) : null}
                  <ListItemText primary={name} />
                </MenuItem>
              )
            })}
            <Divider />
            <MenuItem onClick={this.handleDelete}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="Delete entry" />
            </MenuItem>
          </Menu>
          {requiredFields.map(name => this.renderField(name, entry[name]))}
        </div>
        <div className={classes.fields}>
          {presentFields.map(name => this.renderField(name, entry[name]))}
        </div>
      </div>
    )
  }

  static fields = {
    quantity: {
      required: true,
      component: TextField,
      icon: SwapHorizIcon,
      props: props => ({
        type: 'number',
        className: props.classes.inputXS,
      }),
    },
    cellar: {
      required: true,
      component: SelectField,
      icon: LayersIcon,
      props: props => ({
        options: cellars.all,
        labelAccessor: 'title',
        keyAccessor: 'id',
        valueAccessor: '$ref',
        className: props.classes.inputMD,
      }),
    },
    when: {
      required: true,
      component: DateField,
      props: props => ({
        className: props.classes.inputMD,
      }),
    },
    how: {
      component: SelectField,
      icon: ShoppingCartIcon,
      props: props => ({
        className: props.classes.inputMD,
        options: procurements.map(procurement => ({
          value: procurement,
          label: procurement,
        })),
      }),
    },
    where: {
      component: TextField,
      icon: RoomIcon,
      props: props => ({
        className: props.classes.inputLG,
      }),
    },
    who: {
      component: TextField,
      icon: PersonIcon,
      props: props => ({
        className: props.classes.inputLG,
      }),
    },
    references: {
      component: ArrayField,
      icon: GridOnIcon,
      props: props => ({
        element: <TextField label="Ref" />,
        className: props.classes.inputMD,
      }),
    },
    rate: {
      component: SelectField,
      icon: StarIcon,
      props: props => ({
        className: props.classes.inputXS,
        options: ratings.map(rating => ({
          value: rating,
          label: rating,
        })),
      }),
    },
    value: {
      component: TextField,
      icon: AttachMoneyIcon,
      props: props => ({
        className: props.classes.inputXS,
        type: 'number',
      }),
    },
    comment: {
      component: TextField,
      icon: CommentIcon,
      props: props => ({
        className: props.classes.inputXL,
        multiline: true,
      }),
    },
  }

  renderField(name, value) {
    const field = this.constructor.fields[name]

    if (undefined === field) {
      return null
    }

    const {classes} = this.props
    const props = field.props ? field.props(this.props) : {}

    return (
      <div key={name} className={classes.field}>
        {field.required ? null : (
          <IconButton
            onClick={this.handleRemove(name)}
            className={classes.adornment}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        )}
        {field.icon ? <field.icon className={classes.icon} /> : null}
        <field.component
          {...props}
          value={value}
          onChange={this.handleChange(name)}
        />
      </div>
    )
  }
}
