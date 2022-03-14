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
      lang: localStorage.getItem('lang')
    }
  }

  changeLanguage(e) {
    var value = e?.target?.value ? e.target.value : e
    this.props.setLang(value)
  }

  render() {
    let strings = loadTranslations(this.state.lang)
    return (
      <header>
      <nav>
        <li>
          <ul className="nav-links">
            <a className="buttons" href="https://grnh.se/dd38880f3us"><button>{strings.hiring}</button></a>
          </ul>
        </li>
      </nav>
      <a href="https://openzeppelin.com"><img className="logo" src="../../imgs/exports.svg" alt="logo" /></a>
      <nav>
      <li>
        <ul className="nav-links">
          <a className="buttons" href={constants.PATH_HELP}><button>{strings.ethernautHelp}</button></a> 
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
        </ul>
        </li>
      </nav>
    </header>
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
