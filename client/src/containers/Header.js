import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as actions from "../actions";
import * as constants from "../constants";
import { loadTranslations } from "../utils/translations";
import PropTypes from "prop-types";
import { ProgressBar } from 'react-loader-spinner';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dark: false,
      lang: localStorage.getItem("lang")
    };
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {

    var black = getComputedStyle(document.documentElement).getPropertyValue(
      "--black"
    );

    var primaryColor = getComputedStyle(document.documentElement).getPropertyValue(
      "--primary-color"
    );

    if(primaryColor === black) this.toggleDarkMode()
  }

  componentDidUpdate(prevProps) {
    
    if (prevProps && this.props.location !== prevProps.location) {

      let elements = document.getElementsByClassName("level-tile");
      if(elements.length !== 0) {
        for (let i = 0; i < elements.length; i++) {
          let element = elements[i];
          if (element && element.style) element.style.filter = this.state.dark ? this.svgFilter() : null;
        }
      }

      // Change The Ethernaut logo
      var theEthernaut = document.getElementById("the-ethernaut");
      if(theEthernaut && theEthernaut.style) theEthernaut.style.filter = this.state.dark
        ? this.svgFilter()
        : null;

      // Change Arrow
      let isArrowInPage = document.getElementById("arrow");
      if (isArrowInPage && isArrowInPage.style)
        isArrowInPage.style.filter = this.state.dark ? this.svgFilter() : null;

      // Change all custom images
      var imageElements = document.getElementsByClassName("custom-img");
      if(imageElements.length !== 0) {
        for (let i = 0; i < imageElements.length; i++) {
          let element = imageElements[i];
          if(imageElements.length === 0) element = imageElements;
          if (element && element.style) element.style.filter = this.state.dark ? this.svgFilter() : null;
        }
      }
    }
  }

  svgFilter() {
    // Source for the CSS filter:
    // https://codepen.io/sosuke/pen/Pjoqqp?__cf_chl_jschl_tk__=ecc0b72797ae71bc009d6322e3e470773936b386-1604211766-0-ASpz720gXnc6Ej0vzlgY9-KLmlPkldgcOx1wAmGTUCjLZLOxkArNxpRzZ9m8woL-NGmP9LBGVPws8UxMJZrR7O1qFH6QkKtrGVPw6StRnXiK1XTQR_nY905r0XobAG2nOmyC6Zq8mdyPDp1MyHD7JLodJUXCRViXhtmLmRVE_-JGarVJRlxs6k3DzAOQQEJewfp00DjhlD0mxr8ZKpk2yq6IPTZZQ52XYxh26FC5MxLHhs7LuAwhtolmDZyp4_IuwRg8I5m-2--MmvGE8CCqjRWrkE85zgkMXPlOqcZtppRpZhn6Uz9DZAuKheHwVBb0ySIhFYG92bvQOgiKX0TTswB1SHgOLIeqktuyUaAgxI_h
    // The tool has been used to pass from --secondary-color to --primary-color through CSS filters
    // This is because SVGs embedded into <img> tags can't be filled as we can do with inline SVGs
    return "invert(92%) sepia(17%) saturate(168%) hue-rotate(337deg) brightness(98%) contrast(89%)";
  }

  changeLanguage(e) {
    var value = e?.target?.value ? e.target.value : e;
    this.props.setLang(value);
  }

  toggleDarkMode() {
    var documentElement = document.documentElement;
    if(documentElement && documentElement.style) {

    var pink = getComputedStyle(document.documentElement).getPropertyValue(
      "--pink"
    );
    var black = getComputedStyle(document.documentElement).getPropertyValue(
      "--black"
    );

    var newPrimary = this.state.dark ? pink : black;
    var newSecondary = this.state.dark ? black : pink;

  
    document.documentElement.style.setProperty("--primary-color", newPrimary);
    document.documentElement.style.setProperty(
      "--secondary-color",
      newSecondary
    );

    // Change OpenZeppelin logo
    var theLogo = document.getElementById("logo")
    if(theLogo && theLogo.style) theLogo.style.filter = !this.state.dark
      ? this.svgFilter()
      : null;

    // Change The Ethernaut logo
    var theEthernaut = document.getElementById("the-ethernaut");
    if(theEthernaut && theEthernaut.style) theEthernaut.style.filter = !this.state.dark
      ? this.svgFilter()
      : null;

    // Change Arrow
    let isArrowInPage = document.getElementById("arrow");
    if (isArrowInPage && isArrowInPage.style)
      isArrowInPage.style.filter = !this.state.dark ? this.svgFilter() : null;

    // Change Mosaic and levels logo
    let elements = document.getElementsByClassName("level-tile");
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      if (element && element.style) element.style.filter = !this.state.dark ? this.svgFilter() : null;
    }

    // Change all custom images
    elements = document.getElementsByClassName("custom-img");
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      if (element && element.style) element.style.filter = !this.state.dark ? this.svgFilter() : null;
    }

    this.setState({
      dark: !this.state.dark,
    });
  }
  }

  render() {
    let strings = loadTranslations(this.state.lang);
    return (
      <div>
        <div className="lines">
          <center>
            <hr className="top" />
          </center>
          <center>
            <hr className="top" />
          </center>
        </div>
        <center>
          <header>
            <ul className="header-ul">
              <li className="nav-links">
                <a
                  className="buttons hiring-button"
                  href="https://grnh.se/dd38880f3us"
                >
                  <button>{strings.hiring}</button>
                </a>
              </li>
            </ul>
            <a className="logo-container" href="https://openzeppelin.com">
              <img
                id="logo"
                className="logo"
                src="../../imgs/oz-logo.svg"
                alt="logo"
              />
            </a>
            <ul className="header-ul">
              <li className="nav-links">
                <Link
                  to={
                    window.location.pathname !== constants.PATH_ROOT
                      ? constants.PATH_ROOT
                      : constants.PATH_HELP
                  }
                >
                  <button>
                    {window.location.pathname !== constants.PATH_ROOT
                      ? strings.home
                      : strings.ethernautHelp}
                  </button>
                </Link>
              </li>
              <li className="dropdown">
                <div className="icon-buttons" href="/">
                  <i className="fas fa-globe-americas"></i>
                </div>
                <div className="dropdown-content">
                  <a
                    onClick={() => {
                      this.changeLanguage("en");
                    }}
                    href="/"
                  >
                    {strings.english}
                  </a>
                  <a
                    onClick={() => {
                      this.changeLanguage("es");
                    }}
                    href="/"
                  >
                    {strings.spanish}
                  </a>
                  <a
                    onClick={() => {
                      this.changeLanguage("ja");
                    }}
                    href="/"
                  >
                    {strings.japanese}
                  </a>
                  <a
                    onClick={() => {
                      this.changeLanguage("cn_simplified");
                    }}
                    href="/"
                  >
                    {strings.chinese_simplified}
                  </a>
                  <a
                    onClick={() => {
                      this.changeLanguage("ru");
                    }}
                    href="/"
                  >
                    {strings.russian}
                  </a>
                  <a
                    className="contr"
                    href="https://github.com/openzeppelin/ethernaut#modify-or-add-new-languages"
                  >
                    {strings.contributeTranslation}
                  </a>
                </div>
              </li>
              <li className="dropdown">
                <div className="icon-buttons" href="/">
                <i className="fas fa-network-wired"></i>
                </div>
                <div className="dropdown-content">
                      {Object.values(constants.NETWORKS_INGAME).map((network) => {
                      if(network && network.name !== 'local') {
                        return (
                        <a key={network.name}
                          onClick={(e) => {
                            e.preventDefault();
                            
                            async function changeNetwork(){
                              const elements = document.querySelectorAll('.progress-bar-wrapper');
                              elements[0].style.display = 'flex';
                              try {
                                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                                if (Number(chainId) === Number(network.id)) {
                                  return;
                                }
                                await window.ethereum.request({
                                  method: 'wallet_switchEthereumChain',
                                  params: [{ chainId: `0x${Number(network.id).toString(16)}` }],
                                });
                                
                              } catch (switchError) {
                                // This error code indicates that the chain has not been added to MetaMask.
                                if (switchError.code === 4902) {
                                  try {
                                    await window.ethereum.request({
                                      method: 'wallet_addEthereumChain',
                                      params: [
                                        {
                                          chainId: `0x${Number(network.id).toString(16)}`,
                                          chainName: network.name,
                                          rpcUrls: [network.rpcUrl],
                                          nativeCurrency: {
                                            name: network.currencyName,
                                            symbol: network.currencySymbol, 
                                            decimals: 18
                                          },
                                          blockExplorerUrls: [network.blockExplorer]
                                        },
                                      ],
                                    });
                                  } catch (addError) {
                                    console.error("Can't add nor switch to the selected network")
                                  }
                                }
                            }}

                            changeNetwork.bind(this)()
                          }}
                          href="/"
                          >
                          {network.name}
                        </a>
                      )
                      }
                      return null
                  })}
                </div>
              </li>
              <input
                onClick={() => {
                  this.toggleDarkMode();
                }}
                className="toggle"
                type="checkbox"
              />
            </ul>
            <ProgressBar
                height="100"
                width="100"
                borderColor={this.state.dark ? getComputedStyle(document.documentElement).getPropertyValue("--pink") : getComputedStyle(document.documentElement).getPropertyValue("--black")}
                barColor={this.state.dark ? getComputedStyle(document.documentElement).getPropertyValue("--pink") : getComputedStyle(document.documentElement).getPropertyValue("--black")}
                ariaLabel="progress-bar-loading"
                wrapperStyle={{}}
                wrapperClass="progress-bar-wrapper"
                visible={true}
            />
          </header>
        </center>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { allLevelsCompleted: state.player.allLevelsCompleted };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setLang: actions.setLang,
    },
    dispatch
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
