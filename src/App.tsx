import React from 'react';

import { AuthProvider } from './hook/auth';
import Routes from './routes';
import GlobalStyles from './styles/global';

function App() {
  return (
    <AuthProvider>
      <Routes />
      <GlobalStyles />
    </AuthProvider>
  );
}

export default App;
