import React from 'react';
import {connect} from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'

class Header extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dark: false,
      lang: localStorage.getItem('lang')
    }
  }

  changeLanguage(e) {
    var value = e?.target?.value ? e.target.value : e
    this.props.setLang(value)
  }

  toggleDarkMode() {

    var pink = getComputedStyle(document.documentElement).getPropertyValue('--pink');
    var black = getComputedStyle(document.documentElement).getPropertyValue('--black');

    var newPrimary = this.state.dark ? pink : black;
    var newSecondary = this.state.dark ? black : pink;

    document.documentElement.style.setProperty('--primary-color', newPrimary);
    document.documentElement.style.setProperty('--secondary-color', newSecondary);
    // Change logo
    var path = !this.state.dark ? '../../imgs/exports-white.svg' : '../../imgs/exports.svg';
    
    document.getElementById('logo').src = path;

    this.setState({
      dark: !this.state.dark
    })
  }

  render() {
    let strings = loadTranslations(this.state.lang)
    return (
      <center>
        <header>
          <nav>
            <li>
              <ul className="nav-links">
                <a className="buttons" href="https://grnh.se/dd38880f3us"><button>{strings.hiring}</button></a>
              </ul>
            </li>
          </nav>
          <a href="https://openzeppelin.com"><img id='logo' className="logo" src="../../imgs/exports.svg" alt="logo" /></a>
          <nav>
            <li>
              <input onClick={() => {this.toggleDarkMode()}} class="toggle" type="checkbox" />
              <ul className="nav-links">
                <div className="dropdown">
                  <a className="icon-buttons" href='/'><i className="fas fa-globe-americas"></i></a>
                  <div className="dropdown-content">
                    <a onClick={() => {this.changeLanguage('en')}} href='/'>{strings.english}</a>
                    <a onClick={() => {this.changeLanguage('es')}} href='/'>{strings.spanish}</a>
                    <a onClick={() => {this.changeLanguage('ja')}} href='/'>{strings.japanese}</a>
                    <a onClick={() => {this.changeLanguage('cn_simplified')}} href='/'>{strings.chinese_simplified}</a>
                    <a className="contr" href="https://github.com/openzeppelin/ethernaut#modify-or-add-new-languages">{strings.contributeTranslation}</a>
                  </div>
                </div>
                <a className="buttons" href={window.location.pathname !== constants.PATH_ROOT ? constants.PATH_ROOT : constants.PATH_HELP}>
                  <button>{window.location.pathname !== constants.PATH_ROOT ? strings.home : strings.ethernautHelp }
                  </button>
                </a> 
              </ul>
            </li>
          </nav>
        </header>
      </center>
      
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
