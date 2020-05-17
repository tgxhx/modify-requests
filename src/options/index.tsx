import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import Home from './home';

const GlobalStyle = createGlobalStyle`
  html,body {
    height: 100%;
  }
`;

ReactDOM.render(
  <HashRouter>
    <CssBaseline />
    <GlobalStyle />
    <Home />
  </HashRouter>,
  document.getElementById('app')
);

if (process.env.NODE_ENV === 'development') {
  const HMR = (module as any).hot;
  HMR && HMR.accept && HMR.accept();
}
