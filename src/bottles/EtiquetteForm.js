import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next/hooks';
import {makeStyles} from '@material-ui/styles';

import FieldRow from '../form/FieldRow';
import DateField from '../form/DateFieldPicker';
import SelectField from '../form/SelectField';
import TextField from '../form/TextField';
import ImageField from '../form/ImageField';
import AutocompleteField from '../form/AutocompleteField';

import sorts from '../enums/sorts';
import sizes from '../enums/sizes';
import colors from '../enums/colors';
import capsules from '../enums/capsules';
import effervescences from '../enums/effervescences';

const useStyles = makeStyles(theme => ({
  xs: {
    flexBasis: '50px',
    flexGrow: '1',
  },
  sm: {
    flexBasis: '75px',
    flexGrow: '1',
  },
  md: {
    flexBasis: '150px',
    flexGrow: '1',
  },
  lg: {
    flexBasis: '250px',
    flexGrow: '1',
  },
  xl: {
    width: '100%',
  },
}));

function EtiquetteForm({errors = {}, bottle, onChange}) {
  const [fields, sortDef] = useBottleFields(bottle, errors, onChange);

  return (
    <>
      <FieldRow>{fields.etiquette}</FieldRow>
      <FieldRow>
        {fields.sort}
        {fields.appellation}
        {fields.cuvee}
        {sortDef && sortDef.vintage && fields.vintage}
      </FieldRow>
      {sortDef && (sortDef.bottlingDate || sortDef.expirationDate) ? (
        <FieldRow>
          {sortDef.bottlingDate && fields.bottlingDate}
          {sortDef.expirationDate && fields.expirationDate}
        </FieldRow>
      ) : null}
      <FieldRow>
        {fields.producer}
        {fields.region}
        {fields.country}
      </FieldRow>
      <FieldRow>
        {fields.size}
        {fields.color}
        {fields.effervescence}
        {sortDef && fields.type}
      </FieldRow>
      <FieldRow>
        {fields.capsule}
        {fields.alcohol}
        {fields.medal}
        {fields.comment}
      </FieldRow>
    </>
  );
}

export default observer(EtiquetteForm);

export function useBottleFields(bottle, errors, onChange) {
  const classes = useStyles();
  const [t] = useTranslation();

  const sortDef = sorts.find(sort => sort.name === bottle.sort);

  const fields = {
    sort: (
      <SelectField
        label={t('bottle.sort')}
        name="sort"
        value={bottle.sort}
        required={true}
        onChange={onChange}
        //error={null !== errors.sort}
        helperText={errors.sort}
        options={sorts.map(sort => ({
          value: sort.name,
          label: t(`enum.sort.${sort.name}`),
        }))}
        className={classes.xs}
      />
    ),
    etiquette: (
      <ImageField
        label={t('bottle.etiquette')}
        id="bottle-etiquette"
        name="etiquette"
        value={bottle.etiquette}
        onChange={onChange}
        className={classes.md}
        accept="image/*"
      />
    ),
    appellation: (
      <AutocompleteField
        label={t('bottle.appellation')}
        name="appellation"
        required={true}
        value={bottle.appellation}
        onChange={onChange}
        helperText={errors.appellation}
        className={classes.lg}
        namespace="appellation"
      />
    ),
    cuvee: (
      <AutocompleteField
        label={t('bottle.cuvee')}
        name="cuvee"
        value={bottle.cuvee}
        onChange={onChange}
        className={classes.md}
        namespace="cuvee"
      />
    ),
    vintage: (
      <TextField
        label={t('bottle.vintage')}
        name="vintage"
        type="number"
        inputProps={{pattern: '[0-9]{4}'}}
        value={bottle.vintage}
        onChange={onChange}
        className={classes.xs}
      />
    ),
    bottlingDate: (
      <DateField
        label={t('bottle.bottlingDate')}
        name="bottlingDate"
        value={bottle.bottlingDate}
        onChange={onChange}
        className={classes.md}
      />
    ),
    expirationDate: (
      <DateField
        label={t('bottle.expirationDate')}
        name="expirationDate"
        value={bottle.expirationDate}
        onChange={onChange}
        className={classes.md}
      />
    ),
    producer: (
      <AutocompleteField
        label={t('bottle.producer')}
        name="producer"
        value={bottle.producer}
        onChange={onChange}
        className={classes.md}
        namespace="producer"
      />
    ),
    region: (
      <AutocompleteField
        label={t('bottle.region')}
        name="region"
        value={bottle.region}
        onChange={onChange}
        className={classes.md}
        namespace="region"
      />
    ),
    country: (
      <AutocompleteField
        label={t('bottle.country')}
        name="country"
        value={bottle.country}
        onChange={onChange}
        className={classes.md}
        namespace="country"
      />
    ),
    size: (
      <SelectField
        label={t('bottle.size')}
        name="size"
        value={bottle.size}
        onChange={onChange}
        empty={<em>{t('form.select.empty')}</em>}
        options={sizes.map(size => ({
          value: size,
          label: t(`enum.size.${size}`),
        }))}
        className={classes.md}
      />
    ),
    color: (
      <SelectField
        label={t('bottle.color')}
        name="color"
        value={bottle.color}
        onChange={onChange}
        empty={<em>{t('form.select.empty')}</em>}
        options={colors.map(color => ({
          value: color,
          label: t(`enum.color.${color}`),
        }))}
        className={classes.md}
      />
    ),
    effervescence: (
      <SelectField
        label={t('bottle.effervescence')}
        name="effervescence"
        value={bottle.effervescence}
        onChange={onChange}
        empty={<em>{t('form.select.empty')}</em>}
        options={effervescences.map(effervescence => ({
          value: effervescence,
          label: t(`enum.effervescence.${effervescence}`),
        }))}
        className={classes.md}
      />
    ),
    type: (
      <SelectField
        label={t('bottle.type')}
        name="type"
        value={bottle.type}
        onChange={onChange}
        empty={<em>{t('form.select.empty')}</em>}
        options={
          sortDef
            ? sortDef.types.map(type => ({
                value: type,
                label: t(`enum.type.${type}`),
              }))
            : []
        }
        className={classes.md}
      />
    ),
    capsule: (
      <SelectField
        label={t('bottle.capsule')}
        name="capsule"
        value={bottle.capsule}
        onChange={onChange}
        empty={<em>{t('form.select.empty')}</em>}
        options={capsules.map(capsule => ({
          value: capsule,
          label: t(`enum.capsule.${capsule}`),
        }))}
        className={classes.sm}
      />
    ),
    alcohol: (
      <TextField
        type="number"
        label={t('bottle.alcohol')}
        name="alcohol"
        value={bottle.alcohol}
        onChange={onChange}
        className={classes.sm}
      />
    ),
    medal: (
      <TextField
        label={t('bottle.medal')}
        name="medal"
        value={bottle.medal}
        onChange={onChange}
        className={classes.md}
      />
    ),
    comment: (
      <TextField
        label={t('bottle.comment')}
        name="comment"
        value={bottle.comment}
        onChange={onChange}
        className={classes.xl}
      />
    ),
  };

  return [fields, sortDef];
}
