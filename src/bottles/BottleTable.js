import React, {useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import classnames from 'classnames';
import {FixedSizeList as WindowedList} from 'react-window';
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

import useAutoresize from '../hooks/useAutoresize';
import useAnchor from '../hooks/useAnchor';
import uiStore from '../stores/ui';
import {useSearch} from '../stores/searchStore';
import {useSelection} from '../stores/selectionStore';

const useStyle = makeStyles(theme => ({
  tableContainer: {
    overflow: 'auto',
    flexGrow: 1,
    fontFamily: theme.typography.fontFamily,
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    boxSizing: 'border-box',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableRowPicked: {
    fontWeight: 'bold',
  },
  tableRowDisabled: {
    opacity: 0.5,
  },
  tableCell: {
    display: 'flex',
    alignItems: 'center',
    '&:last-child': {
      // override MaterialUI default padding
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
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
  {name: 'producer', sortable: true, width: 200},
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

const ROW_HEIGHT = 56;

function BottleTable({bottles, onLoadBottles}) {
  const classes = useStyle();
  const containerRef = useRef();
  const [width, height] = useAutoresize(containerRef);
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
    cellRenderer: SelectRenderer,
    headerRenderer: () => null,
    props: {padding: 'checkbox'},
  });
  columns.push({
    name: 'action',
    width: 80,
    cellRenderer: ActionRenderer,
    headerRenderer: () => (
      <ColumnsMenu
        onToggle={handleToggleColumn}
        isToggled={handleToggledColumn}
      />
    ),
  });

  function Item({index, style}) {
    if (index === 0) {
      return (
        <HeaderRow classes={classes} style={style}>
          {columns.map(column => (
            <HeaderCell
              key={column.name}
              column={column}
              classes={classes}
              style={{width: column.width}}
              active={Search.isSortActive(column.name)}
              direction={Search.isSortAsc(column.name) ? 'asc' : 'desc'}
              onSort={handleToggleSort(column.name)}
            />
          ))}
        </HeaderRow>
      );
    }

    const realIndex = index - 1;
    const bottle = bottles[realIndex];

    return (
      <BodyRow
        index={realIndex}
        bottle={bottle}
        classes={classes}
        style={style}
      >
        {columns.map(column => (
          <BodyCell
            key={column.name}
            bottle={bottle}
            column={column}
            rowIndex={realIndex}
            classes={classes}
            style={{width: column.width}}
          />
        ))}
      </BodyRow>
    );
  }

  function itemKey(index) {
    if (index === 0) {
      return 'header';
    }

    const row = bottles[index - 1];
    return row.$ref.id;
  }

  return (
    <div className={classes.tableContainer} ref={containerRef}>
      <WindowedList
        height={height}
        itemCount={1 + bottles.length}
        itemSize={ROW_HEIGHT}
        itemKey={itemKey}
        width={width}
      >
        {Item}
      </WindowedList>
    </div>
  );
}

export default observer(BottleTable);

const useCellStyles = makeStyles(theme => ({
  hidden: {
    visibility: 'hidden',
  },
}));

const SelectRenderer = observer(function({bottle, rowIndex}) {
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

const ActionRenderer = observer(function({bottle, rowIndex}) {
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

const BodyCell = function({
  bottle,
  column,
  rowIndex,
  className,
  classes,
  ...props
}) {
  const classNames = classnames(className, classes.tableCell);

  return (
    <TableCell
      component="div"
      variant="body"
      className={classNames}
      style={{height: ROW_HEIGHT}}
      align={column.numeric ? 'right' : 'left'}
      {...column.props}
      {...props}
    >
      {column.cellRenderer ? (
        <column.cellRenderer
          bottle={bottle}
          column={column}
          rowIndex={rowIndex}
        />
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

const BodyRow = observer(function({
  children,
  index,
  bottle,
  className,
  classes,
  ...props
}) {
  const classNames = classnames(className, classes.tableRow, {
    [classes.tableRowHover]: uiStore.bottlePage.overed[index],
    [classes.tableRowPicked]: bottle.status === 'picked',
    [classes.tableRowDisabled]: bottle.stocked === false,
  });

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
      className={classNames}
      {...props}
    >
      {children}
    </div>
  );
});

const HeaderCell = function({
  column,
  className,
  classes,
  active,
  direction,
  onSort,
  ...props
}) {
  const [t] = useTranslation();
  const label = t(`bottle.${column.name}`);

  return (
    <TableCell
      component="div"
      className={classnames(className, classes.tableCell)}
      variant="head"
      align={column.numeric ? 'right' : 'left'}
      {...column.props}
      {...props}
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
            active={active}
            direction={direction}
            onClick={onSort}
          >
            {label}
          </TableSortLabel>
        </Tooltip>
      ) : (
        label
      )}
    </TableCell>
  );
};

const HeaderRow = function({children, className, classes, ...props}) {
  const classNames = classnames(className, classes.tableRow);

  return (
    <div
      className={classNames}
      role="row"
      aria-rowindex="0"
      aria-label="header"
      {...props}
    >
      {children}
    </div>
  );
};

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
