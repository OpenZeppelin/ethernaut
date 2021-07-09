import React from 'react';
import {connect} from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'
import { Link } from 'react-router-dom'
import ConsoleDetect from '../components/ConsoleDetect'
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'

class Header extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      lang: localStorage.getItem('lang')
    }
  }

  changeLanguage(e) {
    this.props.setLang(e.target.value)
  }

  render() {
    const currentPath = this.props.location.pathname
    let strings = loadTranslations(this.state.lang)
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
              <span className="sr-only">{strings.toggleNavigation}</span>
            </button>

            <div className="navbar-brand" style={{paddingTop: '0', paddingBottom: '0', paddingLeft: '25px', lineHeight: '49px'}}>
              <span>
                <a href="https://openzeppelin.com" target="_blank" rel='noopener noreferrer'>
                  <img style={{width: '40px', height: '40px'}} src='../../imgs/openzeppelin-logo.svg' alt='OpenZeppelin'/>
                </a>
              </span>
              &nbsp;
              <Link to={constants.PATH_ROOT}  style={{ textDecoration: 'none' }}>
                <span style={{display: 'inline-block', verticalAlign: 'text-top', lineHeight: '22px'}}>{strings.ethernaut}</span>
              </Link>
            </div>

          </div>

          {/* CONTENT */}
          <div className="navbar-collapse collapse" style={{display: 'block', height: '50px'}}>

            {/* LEFT */}
            <ul className="nav navbar-nav" style={{paddingLeft: '10px'}}>
              <li className={currentPath === constants.PATH_ROOT ? 'active' : ''}>
                <Link to={constants.PATH_ROOT} style={{fontSize: '16px'}}>{strings.home}</Link>
              </li>
              <li className={currentPath === constants.PATH_HELP ? 'active' : ''}>
                <Link to={constants.PATH_HELP} style={{fontSize: '16px'}}>{strings.help}</Link>
              </li>
              <li className={currentPath === constants.PATH_STATS ? 'active' : ''}>
                <Link to={constants.PATH_STATS} style={{fontSize: '16px'}}>{strings.stats}</Link>
              </li>
            </ul>

            {/* RIGHT */}
            <ul className="nav navbar-nav pull-right" style={{float: 'right'}}>
            <li>
                <Link to='' style={{fontSize: '16px'}}><ConsoleDetect/></Link>
              </li>
            <li>
              <select style={{fontSize: 'small'}} onChange={this.changeLanguage.bind(this)} value={this.state.lang ? this.state.lang : 'en'}>
                  <option value="en">{strings.english}</option>
                  <option value="es">{strings.spanish}</option>
                </select>
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setLang: actions.setLang
  }, dispatch);
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))
