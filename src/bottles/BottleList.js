import React from 'react';
import {observer} from 'mobx-react-lite';
import {Link} from '@reach/router';
import {useTranslation} from 'react-i18next/hooks';
import classnames from 'classnames';
import {AutoSizer, List as VirtualizedList} from 'react-virtualized';
import {makeStyles} from '@material-ui/styles';
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';

import {BottleIcon, CheckIcon} from '../ui/Icons';
import useLocale from '../hooks/useLocale';
import useFirebaseImage from '../hooks/useFirebaseImage';
import usePreloadImage from '../hooks/usePreloadImage';
import {useCellar} from '../stores/cellarsStore';
import {useSelection} from '../stores/selectionStore';
import {format} from '../lib/date';

const useStyle = makeStyles(theme => ({
  listContainer: {
    overflow: 'auto',
    flexGrow: 1,
    // paddingBottom: theme.spacing.unit * 10,
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing.unit * 4,
    },
  },
}));

const ROW_HEIGHT = 86;

function BottleList({bottles}) {
  const classes = useStyle();

  function rowRenderer({index, key, style}) {
    const bottle = bottles[index];
    return <BottleItem key={key} bottle={bottle} style={style} />;
  }

  return (
    <div className={classes.listContainer}>
      <AutoSizer>
        {({width, height}) => (
          <VirtualizedList
            rowCount={bottles.length}
            rowHeight={ROW_HEIGHT}
            rowRenderer={rowRenderer}
            width={width}
            height={height}
          />
        )}
      </AutoSizer>
    </div>
  );
}

export default BottleList;

const useItemStyle = makeStyles(theme => ({
  picked: {
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.3,
  },
  selectedAvatar: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.light,
  },
}));

const BottleItem = observer(function({bottle, ...props}) {
  const [selected, select, unselect] = useSelection(bottle);
  const [cellar] = useCellar(bottle.cellar);
  const classes = useItemStyle();
  const [t] = useTranslation();
  const [url] = useFirebaseImage(bottle.etiquette);
  const [ready] = usePreloadImage(url);

  const className = classnames({
    [classes.picked]: bottle.status === 'picked',
    [classes.disabled]:
      ['drank', 'sold', 'given'].indexOf(bottle.status) !== -1,
  });

  function handleSelect(event) {
    event.preventDefault();
    if (selected) {
      unselect();
    } else {
      select();
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleSelect(event);
    }
  }

  const [primary, secondary, tertiary] = bottleRenderer(bottle, cellar, t);

  return (
    <ListItem
      component={Link}
      to={`/bottle/${bottle.$ref.id}`}
      {...props}
    >
      <ListItemAvatar
        tabIndex="0"
        role="button"
        aria-pressed={selected}
        onKeyPress={handleKeyPress}
        onClick={handleSelect}
        aria-label={t('bottle.list.select')}
      >
        <Avatar
          classes={{
            colorDefault: selected ? classes.selectedAvatar : undefined,
          }}
          onClick={handleSelect}
          alt={primary}
          src={!selected && ready ? url : null}
        >
          {selected ? <CheckIcon /> : !ready ? <BottleIcon /> : null}
        </Avatar>
      </ListItemAvatar>
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
    </ListItem>
  );
});

export function bottleRenderer(bottle, cellar, t) {
  const [locale] = useLocale();

  const values = {
    bottlingDate: bottle.bottlingDate
      ? t('bottle.print.bottlingDate', {
          bottlingDate: format(bottle.bottlingDate, 'P', locale),
        })
      : '',
    expirationDate: bottle.expirationDate
      ? t('bottle.print.expirationDate', {
          expirationDate: format(bottle.expirationDate, 'P', locale),
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
  };

  return [
    t('bottle.print.primary', values),
    t('bottle.print.secondary', values),
    t('bottle.print.tertiary', values),
  ];
}
