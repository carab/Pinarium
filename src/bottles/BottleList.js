import React from 'react'
import classnames from 'classnames'
import {observer} from 'mobx-react-lite'
import {makeStyles} from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'

import Container from '../ui/Container'
import {CloseIcon} from '../ui/Icons'

import bottlesStore, {useBottles} from '../stores/bottles'
import {useCellars} from '../stores/cellars'
import BottleMenu from './BottleMenu'

const useStyle = makeStyles(theme => ({
  tableContainer: {
    overflow: 'auto',
  },
}))

export default observer(function BottleList() {
  useBottles()

  const classes = useStyle()

  const columns = [
    {name: 'sort'},
    {name: 'cellar', renderer: CellarRenderer},
    {name: 'vintage', props: {numeric: true}},
    {name: 'appellation'},
    // {name: 'bottlingDate'},
    // {name: 'expirationDate'},
    // {name: 'cuvee'},
    // {name: 'producer'},
    // {name: 'region'},
    // {name: 'country'},
    // {name: 'size'},
    // {name: 'color'},
    // {name: 'effervescence'},
    // {name: 'type'},
    // {name: 'capsule'},
    // {name: 'alcohol'},
    {name: 'medal'},
  ].filter(column => {
    const item = bottlesStore.autocompleteItems.find(
      item => item.name === column.name
    )
    return undefined === item
  })

  const countSelected = bottlesStore.selectedBottles.length
  const countAll = bottlesStore.search.data.items.length

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

  return (
    <Container
      highlighted={countSelected > 0}
      title={
        countSelected > 0
          ? `${countSelected} Selected bottles`
          : `${bottlesStore.search.pagination.total} Bottles`
      }
      actions={
        countSelected > 0 ? (
          <>
            <IconButton
              onClick={handleUnselectAll}
              color="inherit"
              title="Unselect all"
            >
              <CloseIcon />
            </IconButton>
            <BottleMenu bottles={bottlesStore.selectedBottles} />
          </>
        ) : null
      }
    >
      {bottlesStore.all.length ? (
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
                    {column.name}
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
      ) : (
        <Typography>You don't have any bottle yet !</Typography>
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

const CellarRenderer = observer(function({row, column}) {
  const cellarRef = row[column.name]
  const cellars = useCellars()

  if (cellarRef) {
    const cellar = cellars.find(cellar => cellar.$ref.id === cellarRef.id)
    return cellar ? cellar.name : null
  }

  return null
})
