import React from 'react';
import {connect} from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import ConsoleDetect from '../components/ConsoleDetect'
import * as constants from '../constants';

class Header extends React.Component {

  render() {
    const currentPath = this.props.location.pathname
    return (
      <nav className="navbar navbar-default" style={{
        borderRadius: '0px',
        backgroundImage: '',
        backgroundColor: 'red',
        zIndex: 10000
      }}>
        <div style={{height: '50px'}}>

          {/* VERSIONS */}
          { constants.SHOW_VERSION &&
          <div style={{right: '0', position: 'absolute', color: 'lightgray', fontSize: '10px'}}>
            {`v${constants.VERSION}`}
          </div>
          }

          {/* HEADER */}
          <div className="navbar-header">

            <button style={{display: 'none'}} type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
              <span className="sr-only">Toggle navigation</span>
            </button>

            <div className="navbar-brand" style={{paddingTop: '0', paddingBottom: '0', paddingLeft: '25px', lineHeight: '49px'}}>
              <span>
                <a href="https://openzeppelin.com" target="_blank" rel='noopener noreferrer'>
                  <img style={{width: '40px', height: '40px'}} src='../../imgs/openzeppelin-logo.svg' alt='OpenZeppelin'/>
                </a>
              </span>
              &nbsp;
              <Link to={constants.PATH_ROOT}  style={{ textDecoration: 'none' }}>
                <span style={{display: 'inline-block', verticalAlign: 'text-top', lineHeight: '22px'}}>Ethernaut</span>
              </Link>
            </div>

          </div>

          {/* CONTENT */}
          <div className="navbar-collapse collapse" style={{display: 'block', height: '50px'}}>

            {/* LEFT */}
            <ul className="nav navbar-nav" style={{paddingLeft: '10px'}}>
              <li className={currentPath === constants.PATH_ROOT ? 'active' : ''}>
                <Link to={constants.PATH_ROOT} style={{fontSize: '16px'}}>Home</Link>
              </li>
              <li className={currentPath === constants.PATH_HELP ? 'active' : ''}>
                <Link to={constants.PATH_HELP} style={{fontSize: '16px'}}>Help</Link>
              </li>
            </ul>

            {/* RIGHT */}
            <ul className="nav navbar-nav pull-right" style={{float: 'right'}}>
              <li>
                <Link to='' style={{fontSize: '16px'}}><ConsoleDetect/></Link>
              </li>
            </ul>
          </div>
        </div>

      </nav>
    );
  }
}


function mapStateToProps(state) {
  return { allLevelsCompleted: state.player.allLevelsCompleted }
}

export default withRouter(connect(mapStateToProps)(Header))
