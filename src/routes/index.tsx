import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import Home from '../pages/Home';
import Events from '../pages/Events';

const routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/events" exact component={Events} />
      </Switch>
    </BrowserRouter>
  );
};

export default routes;
