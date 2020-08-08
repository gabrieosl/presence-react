import React from 'react';

import { ThemeProvider } from '@material-ui/core/styles';
import { AuthProvider } from './hook/auth';
import Routes from './routes';
import theme from './styles/theme';
import GlobalStyles from './styles/global';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes />
        <GlobalStyles />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
