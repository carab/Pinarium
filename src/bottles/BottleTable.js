import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import classnames from 'classnames';
import {
  AutoSizer,
  Column,
  SortDirection,
  Table as VirtualizedTable,
} from 'react-virtualized';
import {makeStyles} from '@material-ui/styles';
import {
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core';

import BottleMenu from './BottleMenu';
import FieldRenderer from '../field/FieldRenderer';
import {ColumnsIcon} from '../ui/Icons';
import Link from '../ui/Link';

import useAnchor from '../hooks/useAnchor';
import uiStore from '../stores/ui';
import {useSearch} from '../stores/searchStore';
import {useSelection} from '../stores/selectionStore';

const useStyle = makeStyles(theme => ({
  tableContainer: {
    overflow: 'auto',
    flexGrow: 1,
  },
  table: {
    fontFamily: theme.typography.fontFamily,
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
    '&:last-child': {
      // override MaterialUI default padding
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
  },
  tableCellPicked: {
    fontWeight: 'bold',
  },
  tableCellDisabled: {
    opacity: 0.3,
  },
}));

const COLUMNS = [
  {name: 'sort', width: 40},
  {name: 'cellar', width: 100},
  {name: 'appellation', sortable: true, width: 200},
  {name: 'vintage', numeric: true, sortable: true, width: 110},
  {name: 'bottlingDate', sortable: true, width: 50},
  {name: 'expirationDate', sortable: true, width: 50},
  {name: 'cuvee', width: 150},
  {name: 'producer', width: 150},
  {name: 'region', width: 100},
  {name: 'country', width: 100},
  {name: 'size', sortable: true, width: 100},
  {name: 'color', width: 100},
  {name: 'effervescence', width: 100},
  {name: 'type', width: 100},
  {name: 'capsule', width: 100},
  {name: 'alcohol', sortable: true, width: 100},
  {name: 'medal', width: 100},
  {name: 'status', width: 100},
  {name: 'rating', sortable: true, width: 40},
  {name: 'inDate', sortable: true, width: 50},
  {name: 'outDate', sortable: true, width: 50},
  {name: 'buyingPrice', width: 40},
  {name: 'sellingPrice', width: 40},
];

const HEADER_HEIGHT = 56;
const ROW_HEIGHT = 56;

function BottleTable({bottles, onLoadBottles}) {
  const classes = useStyle();
  const [t] = useTranslation();
  const Search = useSearch();

  function handleToggleColumn(column) {
    return event => Search.toggleColumn(column);
  }

  function handleToggleSort(sort) {
    return event => Search.toggleSort(sort);
  }

  function handleToggledColumn(column) {
    return Search.isColumn(column);
  }

  const columns = COLUMNS.filter(column => Search.isColumn(column.name));
  columns.unshift({
    name: 'select',
    width: 80,
    cellRenderer: ({bottle, column}) => <SelectCell bottle={bottle} />,
    headerRenderer: () => null,
    props: {padding: 'checkbox'},
  });
  columns.push({
    name: 'action',
    width: 80,
    // cellRenderer: ({bottle, column}) => <ActionCell bottle={bottle} />,
    cellRenderer: () => null,
    headerRenderer: () => (
      <ColumnsMenu
        onToggle={handleToggleColumn}
        isToggled={handleToggledColumn}
      />
    ),
  });

  function cellRenderer({rowData, columnData}) {
    return (
      <DefaultCell bottle={rowData} column={columnData} classes={classes} />
    );
  }

  // const directions = {
  //   [SortDirection.ASC]: 'asc',
  //   [SortDirection.DESC]: 'desc',
  // }

  function headerRenderer({columnData: column, sortBy, sortDirection}) {
    const label = t(`bottle.${column.name}`);
    return (
      <TableCell
        component="div"
        className={classnames(classes.tableCell, classes.flexContainer)}
        variant="head"
        style={{height: HEADER_HEIGHT}}
        align={column.numeric ? 'right' : 'left'}
        {...column.props}
      >
        {column.headerRenderer ? (
          <column.headerRenderer column={column} />
        ) : column.sortable ? (
          <Tooltip
            title={t('bottle.list.sort')}
            placement={'bottom-end'}
            enterDelay={300}
          >
            <TableSortLabel
              active={Search.isSortActive(column.name)}
              direction={Search.isSortAsc(column.name) ? 'asc' : 'desc'}
              onClick={handleToggleSort(column.name)}
            >
              {label}
            </TableSortLabel>
          </Tooltip>
        ) : (
          label
        )}
      </TableCell>
    );
  }

  function rowRenderer({
    className,
    columns,
    index,
    key,
    rowData: bottle,
    style,
  }) {
    const classNames = classnames(className, classes.flexContainer, {
      [classes.tableRow]: index !== -1,
      [classes.tableRowHover]: index !== -1,
    });

    return (
      <TableRow
        className={classNames}
        bottle={bottle}
        key={key}
        index={index}
        style={style}
      >
        {columns}
      </TableRow>
    );
  }

  function headerRowRenderer({className, columns, style}) {
    const classNames = classnames(className, classes.flexContainer);

    return (
      <div className={classNames} role="row" style={style}>
        {columns}
      </div>
    );
  }

  return (
    <div className={classes.tableContainer}>
      <AutoSizer>
        {({height, width}) => (
          <VirtualizedTable
            className={classes.table}
            height={height}
            width={width}
            rowCount={bottles.length}
            rowGetter={({index}) => bottles[index]}
            rowHeight={ROW_HEIGHT}
            headerHeight={HEADER_HEIGHT}
            rowRenderer={rowRenderer}
            headerRowRenderer={headerRowRenderer}
          >
            {columns.map(column => (
              <Column
                key={column.name}
                dataKey={column.name}
                columnData={column}
                headerRenderer={headerRenderer}
                cellRenderer={cellRenderer}
                className={classes.flexContainer}
                width={column.width}
              />
            ))}
          </VirtualizedTable>
        )}
      </AutoSizer>
    </div>
  );
}

const SelectCell = observer(function({bottle}) {
  const [selected, select, unselect] = useSelection(bottle);
  const [t] = useTranslation();

  function handleSelect(event) {
    if (selected) {
      unselect();
    } else {
      select();
    }
  }

  function handleClick(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  return (
    <Checkbox
      inputProps={{
        'aria-label': selected
          ? t('bottle.list.unselect')
          : t('bottle.list.select'),
      }}
      checked={selected}
      onChange={handleSelect}
      onClick={handleClick}
    />
  );
});

const ActionCell = function({bottle}) {
  return <BottleMenu bottles={[bottle]} />;
};

const DefaultCell = function({bottle, column, classes}) {
  return (
    <TableCell
      component="div"
      className={classnames(classes.tableCell, classes.flexContainer, {
        [classes.tableCellPicked]: bottle.status === 'picked',
        [classes.tableCellDisabled]: bottle.stocked === false,
      })}
      variant="body"
      style={{height: ROW_HEIGHT}}
      align={column.numeric ? 'right' : 'left'}
      {...column.props}
    >
      {column.cellRenderer ? (
        column.cellRenderer({
          bottle,
          column,
        })
      ) : (
        <FieldRenderer
          value={bottle[column.name]}
          name={column.name}
          namespace="bottle"
        />
      )}
    </TableCell>
  );
};

const TableRow = observer(function({children, index, bottle, style, ...props}) {
  const a11yProps = {'aria-rowindex': index + 1};

  a11yProps['aria-label'] = 'row';
  a11yProps.tabIndex = 0;

  // a11yProps.onClick = event => onRowClick({event, index, rowData})
  function handleMouseOver(event) {
    uiStore.bottlePage.overed = bottle;
  }

  function handleMouseOut(event) {
    uiStore.bottlePage.overed = null;
  }

  return (
    <Link
      color="inherit"
      variant="inherit"
      underline="none"
      role="row"
      aria-label="row"
      tabIndex={0}
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseOver}
      style={style}
      to={`/bottle/${bottle.$ref.id}`}
      {...props}
    >
      {children}
    </Link>
  );
});

export default observer(BottleTable);

const ColumnsMenu = observer(function({onToggle, isToggled}) {
  const [anchor, open, handleOpen, handleClose] = useAnchor();
  const [t] = useTranslation();

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
  );
});
