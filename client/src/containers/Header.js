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

    // Source for the CSS filter: 
    // https://codepen.io/sosuke/pen/Pjoqqp?__cf_chl_jschl_tk__=ecc0b72797ae71bc009d6322e3e470773936b386-1604211766-0-ASpz720gXnc6Ej0vzlgY9-KLmlPkldgcOx1wAmGTUCjLZLOxkArNxpRzZ9m8woL-NGmP9LBGVPws8UxMJZrR7O1qFH6QkKtrGVPw6StRnXiK1XTQR_nY905r0XobAG2nOmyC6Zq8mdyPDp1MyHD7JLodJUXCRViXhtmLmRVE_-JGarVJRlxs6k3DzAOQQEJewfp00DjhlD0mxr8ZKpk2yq6IPTZZQ52XYxh26FC5MxLHhs7LuAwhtolmDZyp4_IuwRg8I5m-2--MmvGE8CCqjRWrkE85zgkMXPlOqcZtppRpZhn6Uz9DZAuKheHwVBb0ySIhFYG92bvQOgiKX0TTswB1SHgOLIeqktuyUaAgxI_h
    // The tool has been used to pass from --secondary-color to --primary-color through CSS filters
    // This is because SVGs embedded into <img> tags can't be filled as we can do with inline SVGs
    let svgFilter = 'invert(92%) sepia(17%) saturate(168%) hue-rotate(337deg) brightness(98%) contrast(89%)'

    // Change OpenZeppeling logo
    document.getElementById('logo').style.filter = !this.state.dark ? svgFilter : null;

    // Change The Ethernaut logo
    let isTheEthernautInPage = document.getElementById('theEthernaut');
    if(isTheEthernautInPage) isTheEthernautInPage.style.filter = !this.state.dark ? svgFilter : null;

    // Change Arrow
    let isArrowInPage = document.getElementById('arrow');
    if(isArrowInPage) isArrowInPage.style.filter = !this.state.dark ? svgFilter : null;

    // Change Mosaic and levels logo
    let elements = document.getElementsByClassName('levelTile');
    for(let i = 0; i< elements.length; i++) {
      let element = elements[i];
      if(element) element.style.filter = !this.state.dark ? svgFilter : null;
    }

    // Change all custom images
    elements = document.getElementsByClassName('customImg');
    for(let i = 0; i< elements.length; i++) {
      let element = elements[i];
      if(element) element.style.filter = !this.state.dark ? svgFilter : null;
    }

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
          <a href="https://openzeppelin.com"><img id='logo' className="logo" src="../../imgs/oz-logo.svg" alt="logo" /></a>
          <nav>
            <li>
              <input onClick={() => {this.toggleDarkMode()}} className="toggle" type="checkbox" />
              <ul className="nav-links">
                <div className="dropdown">
                  <a className="icon-buttons" href='/'><i className="fas fa-globe-americas"></i></a>
                  <div className="dropdown-content">
                    <a onClick={() => {this.changeLanguage('en')}} href='/'>{strings.english}</a>
                    <a onClick={() => {this.changeLanguage('es')}} href='/'>{strings.spanish}</a>
                    <a onClick={() => {this.changeLanguage('ja')}} href='/'>{strings.japanese}</a>
                    <a onClick={() => {this.changeLanguage('cn_simplified')}} href='/'>{strings.chinese_simplified}</a>
                    <a onClick={() => {this.changeLanguage('ru')}} href='/'>{strings.russian}</a>
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
