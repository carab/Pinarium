import React from 'react';
import {observer} from 'mobx-react-lite';
import classnames from 'classnames';
import {makeStyles} from '@material-ui/styles';
import {lighten} from '@material-ui/core/styles/colorManipulator';
import {Toolbar, Paper, Typography, Portal} from '@material-ui/core';

import uiStore from '../stores/ui';
import useSize from '../hooks/useSize';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  sm: {
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
      maxWidth: '600px',
    },
  },
  highlighted:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  actions: {
    marginLeft: 'auto',
  },
}));

export default function Container({
  title,
  actions,
  children,
  size,
  highlighted,
  startAdornment,
  className,
  ...props
}) {
  const classes = useStyle();
  const isSmall = useSize('sm', 'down');

  return (
    <Paper
      {...props}
      className={classnames(className, classes.root, {
        [classes.sm]: size === 'sm',
      })}
    >
      <PageHeader
        portal={isSmall}
        title={
          <>
            {startAdornment || null}
            {title ? (
              <Typography variant="h6" color="inherit">
                {title}
              </Typography>
            ) : null}
          </>
        }
        actions={
          actions ? <div className={classes.actions}>{actions}</div> : null
        }
        className={classnames({
          [classes.highlighted]: highlighted,
        })}
      />
      {children}
    </Paper>
  );
}

const PageHeader = observer(function({title, actions, portal, ...props}) {
  if (portal) {
    return (
      <>
        {title && <Portal container={uiStore.topbar.titleRef}>{title}</Portal>}
        {actions && (
          <Portal container={uiStore.topbar.actionsRef}>{actions}</Portal>
        )}
      </>
    );
  }

  return (
    <Toolbar {...props}>
      {title}
      {actions}
    </Toolbar>
  );
});
