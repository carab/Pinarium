import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import classnames from 'classnames';
import {
  AutoSizer,
  Column,
  // SortDirection,
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
import {Link} from '@reach/router';

import FieldRenderer from '../field/FieldRenderer';
import {ColumnsIcon, VisitIcon} from '../ui/Icons';

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
    // cursor: 'pointer',
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
  {name: 'sort', sortable: true, width: 40},
  {name: 'cellar', sortable: true, width: 100},
  {name: 'appellation', sortable: true, width: 200},
  {name: 'vintage', numeric: true, sortable: true, width: 110},
  {name: 'bottlingDate', sortable: true, width: 50},
  {name: 'expirationDate', sortable: true, width: 50},
  {name: 'cuvee', sortable: true, width: 150},
  {name: 'producer', sortable: true, width: 150},
  {name: 'region', sortable: true, width: 100},
  {name: 'country', sortable: true, width: 100},
  {name: 'size', numeric: true, sortable: true, width: 100},
  {name: 'color', sortable: true, width: 100},
  {name: 'effervescence', sortable: true, width: 100},
  {name: 'type', sortable: true, width: 100},
  {name: 'capsule', sortable: true, width: 100},
  {name: 'alcohol', numeric: true, sortable: true, width: 100},
  {name: 'medal', sortable: true, width: 100},
  {name: 'status', sortable: true, width: 100},
  {name: 'rating', numeric: true, sortable: true, width: 40},
  {name: 'inDate', sortable: true, width: 50},
  {name: 'outDate', sortable: true, width: 50},
  {name: 'buyingPrice', numeric: true, sortable: true, width: 40},
  {name: 'sellingPrice', numeric: true, sortable: true, width: 40},
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
    cellRenderer: props => <SelectCell {...props} />,
    headerRenderer: () => null,
    props: {padding: 'checkbox'},
  });
  columns.push({
    name: 'action',
    width: 80,
    cellRenderer: props => <ActionCell {...props} />,
    // cellRenderer: () => null,
    headerRenderer: () => (
      <ColumnsMenu
        onToggle={handleToggleColumn}
        isToggled={handleToggledColumn}
      />
    ),
  });

  function cellRenderer({rowData, columnData, rowIndex}) {
    return (
      <DefaultCell
        bottle={rowData}
        column={columnData}
        rowIndex={rowIndex}
        classes={classes}
      />
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

const useCellStyles = makeStyles(theme => ({
  hidden: {
    visibility: 'hidden',
  },
}));

const SelectCell = observer(function({bottle, rowIndex}) {
  const [t] = useTranslation();
  const classes = useCellStyles();
  const [selected, select, unselect] = useSelection(bottle);
  const visible = selected || uiStore.bottlePage.overed[rowIndex];

  function handleSelect(event) {
    if (selected) {
      unselect();
    } else {
      select();
    }
  }

  return (
    <Checkbox
      className={visible ? '' : classes.hidden}
      inputProps={{
        'aria-label': selected
          ? t('bottle.list.unselect')
          : t('bottle.list.select'),
      }}
      checked={selected}
      onChange={handleSelect}
    />
  );
});

const ActionCell = observer(function({bottle, rowIndex}) {
  const classes = useCellStyles();
  const visible = uiStore.bottlePage.overed[rowIndex];

  return (
    <IconButton
      className={visible ? '' : classes.hidden}
      component={Link}
      to={`/bottle/${bottle.$ref.id}`}
    >
      <VisitIcon />
    </IconButton>
  );
});

const DefaultCell = function({bottle, column, rowIndex, classes}) {
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
          rowIndex,
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
  function handleMouseOver(event) {
    uiStore.bottlePage.overed[index] = true;
  }

  function handleMouseOut(event) {
    uiStore.bottlePage.overed[index] = false;
  }

  return (
    <div
      role="row"
      aria-rowindex={index + 1}
      aria-label="row"
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseOver}
      style={style}
      {...props}
    >
      {children}
    </div>
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
