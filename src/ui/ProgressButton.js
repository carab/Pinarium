import React from 'react';
import {makeStyles} from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Button} from '@material-ui/core';

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

function ProgressButton({Component, color, loading, size, children, ...props}) {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
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
};

export default ProgressButton;
