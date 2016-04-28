
import React from 'react';

Reaktor.init(
  <Router>
    <Route path="/" content={Home} layout={MainLayout} />
    <Route path="/info" content={Info} layout={MainLayout} />
  </Router>
);


FlowRouter.notFound = {
  action() {
    ReactLayout.render(MainLayout, { content: <NotFound /> });
  }
};
