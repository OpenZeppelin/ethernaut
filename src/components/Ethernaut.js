import { Footer, Header } from '../ui';
import { Main, Root, Wrapper } from './Ethernaut.css';

import ConsoleDetect from './ConsoleDetect';
import React from 'react';
import Sidebar from './Sidebar';

class Home extends React.Component {
  state = { showMenu: false };

  onShowMenu = () => {
    return this.setState((state) =>
      this.setState({ showMenu: !state.showMenu })
    );
  };

  render() {
    console.log(this.state);
    const { children } = this.props;
    const { showMenu } = this.state;
    return (
      <Root>
        <Wrapper>
          <Sidebar onShowMenu={this.onShowMenu} showMenu={showMenu} />
          <Main>
            <Header />
            <>{children}</>
            <ConsoleDetect />
          </Main>
        </Wrapper>
        <Footer />
      </Root>
    );
  }
}

export default Home;
