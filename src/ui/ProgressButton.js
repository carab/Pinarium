import React from 'react';
import {makeStyles} from '@material-ui/styles';
import classnames from 'classnames';
import {Button, CircularProgress} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  progress: {
    display: 'block',
  },
  progressWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

function ProgressButton({
  Component,
  rootProps: {className, ...rootProps},
  color,
  loading,
  size,
  children,
  ...props
}) {
  const classes = useStyles();
  const classNames = classnames(classes.wrapper, className);

  return (
    <div className={classNames} {...rootProps}>
      <Component color={color} disabled={loading} {...props}>
        {children}
      </Component>
      {loading && (
        <div className={classes.progressWrapper}>
          <CircularProgress
            size={size}
            color={color}
            className={classes.progress}
          />
        </div>
      )}
    </div>
  );
}

ProgressButton.defaultProps = {
  size: 24,
  Component: Button,
  rootProps: {},
};

export default ProgressButton;
