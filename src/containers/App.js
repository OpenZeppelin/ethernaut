import React from 'react';
import Sidebar from 'react-sidebar';
import Header from './Header';
import SidebarContent from './Sidebar';
import FontAwesome from 'react-fontawesome';
import ReactGA from 'react-ga'
import * as constants from '../constants'

class App extends React.Component {

  constructor() {
    super()

    // Analytics
    ReactGA.initialize(constants.GOOGLE_ANALYTICS_ID);
    ReactGA.pageview(window.location.pathname);
  }

  componentDidUpdate(prevProps) {
    if(this.props.location !== prevProps.location) {
      this.childrenElement.parentElement.scrollTop = 0
    }
  }

  render() {
    return (
      <div style={{ fontFamily: '"Helvetica Neue", Lato, sans-serif'}}>
        <Header/>

        {/* SPLIT VIEW */}
        <Sidebar
          sidebar={<div style={{ width: '170px' }}><SidebarContent/></div>}
          transitions={false}
          docked={true}
          shadow={false}
          styles={{ root: { top: 82, bottom: 20 }, sidebar: { backgroundColor: '#e5f2fb', boxShadow: 'none' }, content: { overflowX: 'hidden' }}}
        >
          <div ref={el => this.childrenElement = el}>
            {this.props.children}
          </div>
        </Sidebar>

        {/* FOOTER */}
        <footer className="footer navbar-fixed-bottom text-center text-muted">
          <small>developed with <FontAwesome name="heart"/> and <FontAwesome name="flash"/> by the <a href="https://openzeppelin.com">OpenZeppelin</a> team</small>
        </footer>

      </div>
    );
  }
}

export default App;