import React from 'react';
import Mosaic from './Mosaic';
import Header from './Header';
import ReactGA from 'react-ga'
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'

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
    let language = localStorage.getItem('lang')
    let strings = loadTranslations(language)
    // return (
    //   <div style={{ fontFamily: '"Helvetica Neue", Lato, sans-serif'}}>
    //     <Header/>

    //     {/* SPLIT VIEW */}
    //     <Sidebar
    //       sidebar={<div style={{ width: '200px' }}><SidebarContent/></div>}
    //       transitions={false}
    //       docked={true}
    //       shadow={false}
    //       styles={{ root: { top: 62, bottom: 20 }, sidebar: { backgroundColor: '#e5f2fb', boxShadow: 'none' }, content: { overflowX: 'hidden' }}}
    //     >
    //     <div ref={el => this.childrenElement = el}>
    //       {this.props.children}
    //     </div>
    //     </Sidebar>

    //     {/* FOOTER */}
    //     <footer className="footer text-center text-muted">
    //       <small dangerouslySetInnerHTML={{ __html: strings.footer }}></small>
    //     </footer>
    //   </div>
    // );
    return (
      <div>
        <div className="lines">
          <center><hr className="top" /></center>
          <center><hr className="top" /></center>
        </div>
        <Header></Header>
        <main>
          <section className="Titles">
            <img src="../../imgs/R.svg" alt="The-Ethernaut" className="Ethernaut" />
            <img src="../../imgs/Rectangle 286.svg" alt="arrows" className="arrow" />
            <ul>
              <a className="buttons" href="#"><button>Start</button></a>
              <a className="buttons" href="#"><button className="button2">How to play</button></a>
            </ul>      
          </section>

          <Mosaic>
            </Mosaic>
            <section className="Description">
              <center><hr /></center>
              <h2>The <u>Ethernaut</u> is a Web3/Solidity based wargame inspired on overthewire.org, played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'.The game is 100% open source and all levels are contributions made by other players. Do you have an interesting idea? PRs are <button>Welcome</button></h2>
            </section>    
        </main>
        <footer dangerouslySetInnerHTML={{ __html: strings.footer }}>
        </footer>
      </div>
    );
  }
}

export default App;
