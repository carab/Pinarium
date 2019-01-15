import React, {useCallback, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next/hooks'
import classnames from 'classnames'
import {makeStyles} from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TablePagination from '@material-ui/core/TablePagination'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'

import Container from '../ui/Container'
import {CloseIcon, ColumnsIcon} from '../ui/Icons'
import BottleMenu from './BottleMenu'
import BottleDialog from './BottleDialog'
import FieldRenderer from '../field/FieldRenderer'

import {format} from '../lib/date'
import bottlesStore, {useBottles} from '../stores/bottlesStore'
import {useSearch} from '../stores/searchStore'
import useAnchor from '../hooks/useAnchor'
import useLocale from '../hooks/useLocale'
import BottleListMenu from './BottleListMenu'
import BottleList from './BottleList'

const COLUMNS = [
  {name: 'sort'},
  {name: 'cellar'},
  {name: 'appellation', sortable: true},
  {name: 'vintage', props: {numeric: true}, sortable: true},
  {name: 'bottlingDate', sortable: true},
  {name: 'expirationDate', sortable: true},
  {name: 'cuvee'},
  {name: 'producer'},
  {name: 'region'},
  {name: 'country'},
  {name: 'size', sortable: true},
  {name: 'color'},
  {name: 'effervescence'},
  {name: 'type'},
  {name: 'capsule'},
  {name: 'alcohol', sortable: true},
  {name: 'medal'},
  {name: 'status'},
  {name: 'rating', sortable: true},
  {name: 'inDate', sortable: true},
  {name: 'outDate', sortable: true},
  {name: 'buyingPrice'},
  {name: 'sellingPrice'},
]

const useStyle = makeStyles(theme => ({
  tableContainer: {
    overflow: 'auto',
    flexGrow: 1,
  },
  tablePagination: {
    paddingRight: theme.spacing.unit * 8,
  },
  empty: {
    textAlign: 'center',
    padding: theme.spacing.unit * 2,
  },
  selectAll: {
    marginRight: theme.spacing.unit,
    marginLeft: (theme.spacing.unit * -3) / 2,
  },
}))

export default observer(function BottlePage() {
  const Search = useSearch()
  const [bottles, ready] = useBottles(Search.visibility)

  useEffect(
    () => {
      console.log('bouuuh')
      Search.source = bottles
    },
    [bottles]
  )

  const classes = useStyle()
  const [t] = useTranslation()

  const columns = COLUMNS.filter(column => Search.isColumn(column.name))

  const visibleBottles = Search.search.data.items
  const countSelected = bottlesStore.selectedBottles.length
  const countAll = Search.search.pagination.total
  const allSelected = countSelected === countAll
  const someSelected = !allSelected && countSelected >= 1
  const allVisibleSelected = visibleBottles.every(bottle =>
    bottlesStore.isSelected(bottle)
  )
  const someVisibleSelected =
    !allVisibleSelected &&
    visibleBottles.some(bottle => bottlesStore.isSelected(bottle))

  function handleUnselectAll() {
    bottlesStore.unselect()
  }

  function handleSelectAll() {
    if (allSelected) {
      bottlesStore.unselect()
    } else {
      bottlesStore.select()
    }
  }

  function handleSelectVisible() {
    if (allVisibleSelected) {
      bottlesStore.unselect(visibleBottles)
    } else {
      bottlesStore.select(visibleBottles)
    }
  }

  const handleSelect = bottle => event => {
    if (bottlesStore.isSelected(bottle)) {
      bottlesStore.unselect([bottle])
    } else {
      bottlesStore.select([bottle])
    }
  }

  const handleToggleColumn = column => event => {
    Search.toggleColumn(column)
  }

  const handleToggleSort = sort => event => {
    Search.toggleSort(sort)
  }

  function handleChangePage(event, page) {
    Search.setPage(page)
  }

  const handleToggledColumn = useCallback(column => Search.isColumn(column))

  if (!ready) {
    return null
  }

  return (
    <>
      <BottleDialog />
      <Container
        highlighted={countSelected > 0}
        title={
          countSelected > 0 ? (
            <>
              <Checkbox
                className={classes.selectAll}
                indeterminate={someSelected}
                checked={allSelected}
                onChange={handleSelectAll}
                color="primary"
              />
              {t('bottle.list.selected', {count: countSelected})}
            </>
          ) : (
            t('bottle.list.title', {count: countAll})
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
          ) : (
            <>
              <BottleListMenu columns={COLUMNS} />
            </>
          )
        }
      >
        {bottles.length ? (
          <>
            <Hidden mdUp>
              <BottleList
                bottles={visibleBottles}
                isSelected={bottle => bottlesStore.isSelected(bottle)}
                onSelect={handleSelect}
              />
            </Hidden>
            <Hidden smDown>
              <div className={classes.tableContainer}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={someVisibleSelected}
                          checked={allVisibleSelected}
                          onChange={handleSelectVisible}
                        />
                      </TableCell>
                      {columns.map(column => (
                        <TableCell key={column.name} {...column.props}>
                          {column.sortable ? (
                            <Tooltip
                              title={t('bottle.list.sort')}
                              placement={'bottom-end'}
                              enterDelay={300}
                            >
                              <TableSortLabel
                                active={Search.isSortActive(column.name)}
                                direction={
                                  Search.isSortAsc(column.name) ? 'asc' : 'desc'
                                }
                                onClick={handleToggleSort(column.name)}
                              >
                                {t(`bottle.${column.name}`)}
                              </TableSortLabel>
                            </Tooltip>
                          ) : (
                            t(`bottle.${column.name}`)
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <ColumnsMenu
                          onToggle={handleToggleColumn}
                          isToggled={handleToggledColumn}
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visibleBottles.map(bottle => (
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
              <TablePagination
                className={classes.tablePagination}
                rowsPerPageOptions={[Search.perPage]}
                component="div"
                count={countAll}
                rowsPerPage={Search.perPage}
                page={Search.page}
                backIconButtonProps={{
                  'aria-label': t('bottle.list.pagination.previous'),
                }}
                nextIconButtonProps={{
                  'aria-label': t('bottle.list.pagination.next'),
                }}
                //labelDisplayedRows={}
                labelDisplayedRows={({from, to, count}) =>
                  t('bottle.list.pagination.current', {from, to, count})
                }
                onChangePage={handleChangePage}
                //onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Hidden>
          </>
        ) : (
          <Typography className={classes.empty}>
            {t('bottle.list.empty')}
          </Typography>
        )}
      </Container>
    </>
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
            <FieldRenderer
              value={bottle[column.name]}
              name={column.name}
              namespace="bottle"
            />
          )}
        </TableCell>
      ))}
      <TableCell>
        <BottleMenu bottles={[bottle]} />
      </TableCell>
    </TableRow>
  )
})

const ColumnsMenu = observer(function({onToggle, isToggled}) {
  const [anchor, open, handleOpen, handleClose] = useAnchor()
  const [t] = useTranslation()

  return (
    <>
      <IconButton
        aria-owns={open ? 'columns-menu' : undefined}
        aria-haspopup="true"
        onClick={handleOpen}
        color="inherit"
        title={t('bottle.list.open_columns')}
        aria-label={t('bottle.list.open_columns')}
      >
        <ColumnsIcon />
      </IconButton>
      <Menu
        id="columns-menu"
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        {COLUMNS.map(({name}) => (
          <MenuItem key={name} onClick={onToggle(name)}>
            <Checkbox checked={isToggled(name)} />
            {t(`bottle.${name}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
})
