import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next/hooks'
import classnames from 'classnames'
import {
  AutoSizer,
  InfiniteLoader,
  List as VirtualizedList,
} from 'react-virtualized'
import {makeStyles} from '@material-ui/styles'
import {
  List,
  ListItem,
  Checkbox,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core'
import {useCellar} from '../stores/cellarsStore'
import BottleMenu from './BottleMenu'
import useLocale from '../hooks/useLocale'
import {format} from '../lib/date'

const useStyle = makeStyles(theme => ({
  listContainer: {
    overflow: 'auto',
    flexGrow: 1,
    // paddingBottom: theme.spacing.unit * 10,
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing.unit * 4,
    },
  },
}))

function BottleList({bottles, isSelected, onSelect, onLoadBottles}) {
  const classes = useStyle()

  function rowRenderer({index, key, style}) {
    const bottle = bottles[index]
    return (
      <BottleItem
        key={key}
        style={style}
        bottle={bottle}
        selected={isSelected(bottle)}
        onSelect={onSelect(bottle)}
      />
    )
  }
  return (
    <div
      className={classes.listContainer}
    >
      <AutoSizer disableWidth disableHeight>
        {({width, height}) => (
          <VirtualizedList
            rowCount={bottles.length}
            rowHeight={86}
            rowRenderer={rowRenderer}
            width={300}
            height={400}
          />
        )}
      </AutoSizer>
    </div>
  )
}

export default BottleList

const useItemStyle = makeStyles(theme => ({
  picked: {
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.3,
  },
}))

const BottleItem = observer(function({bottle, selected, onSelect}) {
  const classes = useItemStyle()
  const [t] = useTranslation()
  const [cellar] = useCellar(bottle.cellar)

  const className = classnames({
    [classes.picked]: bottle.status === 'picked',
    [classes.disabled]:
      ['drank', 'sold', 'given'].indexOf(bottle.status) !== -1,
  })

  const [primary, secondary, tertiary] = bottleRenderer(bottle, cellar, t)

  return (
    <ListItem ContainerComponent="div">
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
        <BottleMenu bottles={[bottle]} />
      </ListItemSecondaryAction>
    </ListItem>
  )
})

export function bottleRenderer(bottle, cellar, t) {
  const [locale] = useLocale()

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
  }

  return [
    t('bottle.print.primary', values),
    t('bottle.print.secondary', values),
    t('bottle.print.tertiary', values),
  ]
}
