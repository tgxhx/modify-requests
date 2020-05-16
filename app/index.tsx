import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Popup from './popup';

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <Popup />
  </React.Fragment>,
  document.getElementById('app')
);
