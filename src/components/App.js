import * as constants from '../constants';

import { Route, Router, Switch } from 'react-router-dom';

import Ethernaut from './Ethernaut/Ethernaut';
import Help from './Ethernaut/Help';
import Home from './Ethernaut/Home';
import Level from './Ethernaut/Level';
import NotFoundPage from './NotFoundPage';
import { Provider } from 'react-redux';
import React from 'react';
import ReactGA from 'react-ga';
import { Root } from './App.css';
import Stats from './Ethernaut/Stats';
import { createBrowserHistory } from 'history';
import { store } from '../store';
import { syncHistoryWithStore } from 'react-router-redux';

const history = syncHistoryWithStore(createBrowserHistory(), store);

class App extends React.Component {
  componentWillMount() {
    ReactGA.initialize(constants.GOOGLE_ANALYTICS_ID);
    ReactGA.pageview(window.location.pathname);
  }
  render() {
    return (
      <Provider store={store}>
        <Root>
          <Router history={history}>
            <Ethernaut>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path={constants.PATH_HELP} component={Help} />
                <Route path={constants.PATH_LEVEL} component={Level} />
                <Route path={constants.PATH_STATS} component={Stats} />
                <Route path="*" exact component={NotFoundPage} />
              </Switch>
            </Ethernaut>
          </Router>
        </Root>
      </Provider>
    );
  }
}

export default App;
