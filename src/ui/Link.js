import React from 'react';
import {Link as MaterialLink} from '@material-ui/core';
import {Link as RouterLink} from '@reach/router';

function Link(props) {
  return <MaterialLink component={RouterLink} {...props} />;
}

export default Link;
