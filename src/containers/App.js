import * as constants from '../constants';

import { Main, Root, Wrapper } from '../components/Ethernaut.css';

import { Footer } from '../components/ui';
import Header from './Header';
import React from 'react';
import ReactGA from 'react-ga';
import Sidebar from './Sidebar';

class App extends React.Component {
  constructor() {
    super();

    // Analytics
    ReactGA.initialize(constants.GOOGLE_ANALYTICS_ID);
    ReactGA.pageview(window.location.pathname);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.childrenElement.parentElement.scrollTop = 0;
    }
  }

  render() {
    return (
      <Root>
        <Wrapper>
          <Sidebar />
          <Main ref={(el) => (this.childrenElement = el)}>
            <Header />
            {this.props.children}
          </Main>
        </Wrapper>
        <Footer />
      </Root>
    );
  }
}

export default App;
