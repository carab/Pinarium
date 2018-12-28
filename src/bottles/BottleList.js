import React from 'react'
import {format} from 'date-fns'
import {observer} from 'mobx-react-lite'
import {Trans, useTranslation} from 'react-i18next/hooks'
import classnames from 'classnames'
import {makeStyles} from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

import Container from '../ui/Container'
import {CloseIcon} from '../ui/Icons'
import BottleMenu from './BottleMenu'

import bottlesStore, {useBottles} from '../stores/bottles'
import {useCellar} from '../stores/cellars'

const useStyle = makeStyles(theme => ({
  tableContainer: {
    overflow: 'auto',
  },
  empty: {
    textAlign: 'center',
    padding: theme.spacing.unit * 2,
  },
}))

export default observer(function BottleList() {
  useBottles()

  const classes = useStyle()
  const [t] = useTranslation()

  const columns = [
    {name: 'sort', renderer: EnumRenderer},
    {name: 'cellar', renderer: CellarRenderer},
    {name: 'vintage', props: {numeric: true}},
    {name: 'appellation'},
    {name: 'bottlingDate', renderer: DateRenderer},
    {name: 'expirationDate', renderer: DateRenderer},
    {name: 'cuvee'},
    {name: 'producer'},
    {name: 'region'},
    {name: 'country'},
    {name: 'size', renderer: EnumRenderer},
    {name: 'color', renderer: EnumRenderer},
    {name: 'effervescence', renderer: EnumRenderer},
    {name: 'type', renderer: EnumRenderer},
    {name: 'capsule', renderer: EnumRenderer},
    {name: 'alcohol'},
    {name: 'medal'},
  ].filter(column => {
    const item = bottlesStore.autocompleteItems.find(
      item => item.name === column.name
    )
    return undefined === item
  })

  const countSelected = bottlesStore.selectedBottles.length
  const countAll = bottlesStore.search.pagination.total

  const handleSelectAll = event => {
    if (countSelected === countAll) {
      handleUnselectAll(event)
    } else {
      const bottles = bottlesStore.search.data.items
      bottlesStore.select(bottles)
    }
  }

  const handleUnselectAll = event => {
    const bottles = bottlesStore.search.data.items
    bottlesStore.unselect(bottles)
  }

  const handleSelect = bottle => event => {
    if (bottlesStore.isSelected(bottle)) {
      bottlesStore.unselect([bottle])
    } else {
      bottlesStore.select([bottle])
    }
  }

  if (!bottlesStore.ready) {
    return null
  }

  return (
    <Container
      highlighted={countSelected > 0}
      title={
        countSelected > 0 ? (
          <Trans
            i18nKey="bottle.list.selected"
            count={countSelected}
            values={{count: countSelected}}
          />
        ) : (
          <Trans
            i18nKey="bottle.list.title"
            count={countAll}
            values={{count: countAll}}
          />
        )
      }
      actions={
        countSelected > 0 ? (
          <>
            <IconButton
              onClick={handleUnselectAll}
              color="inherit"
              title={t('bottle.list.unselectAll')}
            >
              <CloseIcon />
            </IconButton>
            <BottleMenu bottles={bottlesStore.selectedBottles} />
          </>
        ) : null
      }
    >
      {bottlesStore.all.length ? (
        <>
          <Hidden mdUp>
            <div className={classes.demo}>
              <List dense>
                {bottlesStore.search.data.items.map(bottle => (
                  <BottleItem
                    key={bottle.$ref.id}
                    bottle={bottle}
                    columns={columns}
                    selected={bottlesStore.isSelected(bottle)}
                    onSelect={handleSelect(bottle)}
                  />
                ))}
              </List>
            </div>
          </Hidden>
          <Hidden smDown>
            <div className={classes.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          countSelected > 0 && countSelected < countAll
                        }
                        checked={countSelected === countAll}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    {columns.map(column => (
                      <TableCell key={column.name} {...column.props}>
                        {t(`bottle.${column.name}`)}
                      </TableCell>
                    ))}
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bottlesStore.search.data.items.map(bottle => (
                    <BottleRow
                      key={bottle.$ref.id}
                      bottle={bottle}
                      columns={columns}
                      selected={bottlesStore.isSelected(bottle)}
                      onSelect={handleSelect(bottle)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </Hidden>
        </>
      ) : (
        <Typography className={classes.empty}>
          {t('bottle.list.empty')}
        </Typography>
      )}
    </Container>
  )
})

const useStyles = makeStyles(theme => ({
  picked: {
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.3,
  },
}))

const BottleRow = observer(function({bottle, columns, selected, onSelect}) {
  const classes = useStyles()

  const className = classnames({
    [classes.picked]: bottle.status === 'picked',
    [classes.disabled]:
      ['drank', 'sold', 'given'].indexOf(bottle.status) !== -1,
  })

  return (
    <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onSelect} />
      </TableCell>
      {columns.map(column => (
        <TableCell key={column.name} className={className} {...column.props}>
          {column.renderer ? (
            <column.renderer row={bottle} column={column} />
          ) : (
            bottle[column.name]
          )}
        </TableCell>
      ))}
      <TableCell>
        <BottleMenu bottles={[bottle]} showEdit />
      </TableCell>
    </TableRow>
  )
})

const BottleItem = observer(function({bottle, columns, selected, onSelect}) {
  const classes = useStyles()
  const [t] = useTranslation()
  const [cellar] = useCellar(bottle.cellar)

  const className = classnames({
    [classes.picked]: bottle.status === 'picked',
    [classes.disabled]:
      ['drank', 'sold', 'given'].indexOf(bottle.status) !== -1,
  })

  const [primary, secondary, tertiary] = bottleRenderer(bottle, cellar, t)

  return (
    <ListItem>
      <Checkbox checked={selected} onChange={onSelect} />
      <ListItemText
        className={className}
        primary={primary}
        secondary={
          <>
            {secondary}
            <br />
            {tertiary}
          </>
        }
      />
      <ListItemSecondaryAction>
        <BottleMenu bottles={[bottle]} showEdit />
      </ListItemSecondaryAction>
    </ListItem>
  )
})

const CellarRenderer = observer(function({row, column}) {
  const [cellar, ready] = useCellar(row[column.name])

  if (ready) {
    return cellar ? cellar.name : null
  }

  return null
})

const EnumRenderer = function({row, column}) {
  const value = row[column.name]

  if (value) {
    return <Trans i18nKey={`enum.${column.name}.${value}`} />
  }

  return null
}

const DateRenderer = function({row, column}) {
  const date = row[column.name]

  if (date) {
    return date.toString()
  }

  return null
}

export function bottleRenderer(bottle, cellar, t) {
  const values = {
    bottlingDate: bottle.bottlingDate
      ? t('bottle.print.bottlingDate', {
          bottlingDate: format(bottle.bottlingDate, 'P'),
        })
      : '',
    expirationDate: bottle.expirationDate
      ? t('bottle.print.expirationDate', {
          expirationDate: format(bottle.expirationDate, 'P'),
        })
      : '',
    appellation: bottle.appellation
      ? t('bottle.print.appellation', {appellation: bottle.appellation})
      : '',
    vintage: bottle.vintage
      ? t('bottle.print.vintage', {vintage: bottle.vintage})
      : '',
    cuvee: bottle.cuvee ? t('bottle.print.cuvee', {cuvee: bottle.cuvee}) : '',
    producer: bottle.producer
      ? t('bottle.print.producer', {producer: bottle.producer})
      : '',
    region: bottle.region
      ? t('bottle.print.region', {region: bottle.region})
      : '',
    country: bottle.country
      ? t('bottle.print.country', {country: bottle.country})
      : '',
    size: bottle.size ? t('bottle.print.size', {size: bottle.size}) : '',
    color: bottle.color ? t('bottle.print.color', {color: bottle.color}) : '',
    type: bottle.type ? t('bottle.print.type', {type: bottle.type}) : '',
    cellar:
      bottle.cellar && cellar
        ? t('bottle.print.cellar', {cellar: cellar.name})
        : '',
  }

  return [
    t('bottle.print.primary', values),
    t('bottle.print.secondary', values),
    t('bottle.print.tertiary', values),
  ]
}
