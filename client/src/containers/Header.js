import React from "react";
import { connect } from "react-redux";
import { withRouter } from "../hoc/withRouter"
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as actions from "../actions";
import * as constants from "../constants";
import { loadTranslations } from "../utils/translations";
import PropTypes from "prop-types";
import { ProgressBar } from 'react-loader-spinner';
import {  svgFilter } from "../utils/svg";
import LeaderIcon from "../components/leaderboard/LeaderIcon";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dark: false,
      lang: localStorage.getItem("lang"),
      chainId: 0
    };

    if (this.props.web3) {
      window.ethereum.request({ method: 'eth_chainId' }).then((id) => {
        this.setState({ chainId: Number(id) })
      });
    }
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  componentDidMount() {

    // var black = getComputedStyle(document.documentElement).getPropertyValue(
    //   "--black"
    // );

    // var primaryColor = getComputedStyle(document.documentElement).getPropertyValue(
    //   "--primary-color"
    // );

    // if(primaryColor === black) this.toggleDarkMode()
  }

  componentDidUpdate(prevProps) {

    if (prevProps && this.props.location !== prevProps.location) {

      let elements = document.getElementsByClassName("level-tile");
      if (elements.length !== 0) {
        for (let i = 0; i < elements.length; i++) {
          let element = elements[i];
          if (element && element.style) element.style.filter = this.state.dark ? svgFilter() : null;
        }
      }

      // Change The Ethernaut logo
      var theEthernaut = document.getElementById("the-ethernaut");
      if (theEthernaut && theEthernaut.style) theEthernaut.style.filter = this.state.dark
        ? svgFilter()
        : null;

      // Change Arrow
      let isArrowInPage = document.getElementById("arrow");
      if (isArrowInPage && isArrowInPage.style)
        isArrowInPage.style.filter = this.state.dark ? svgFilter() : null;

      // Change all custom images
      var imageElements = document.getElementsByClassName("custom-img");
      if (imageElements.length !== 0) {
        for (let i = 0; i < imageElements.length; i++) {
          let element = imageElements[i];
          if (imageElements.length === 0) element = imageElements;
          if (element && element.style) element.style.filter = this.state.dark ? svgFilter() : null;
        }
      }
    }
  }

  changeLanguage(e, value) {
    e.preventDefault();
    this.props.setLang(value);
  }

  toggleDarkMode() {
    var documentElement = document.documentElement;
    if (documentElement && documentElement.style) {

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
      if (theLogo && theLogo.style) theLogo.style.filter = !this.state.dark
        ? svgFilter()
        : null;

      // // Change OpenZeppelin logo
      // var theChristmashat = document.getElementById("christmas-hat")
      // if (theChristmashat && theChristmashat.style) theChristmashat.style.filter = !this.state.dark
      //   ? svgFilter()
      //   : null;

      // Change The Ethernaut logo
      var theEthernaut = document.getElementById("the-ethernaut");
      if (theEthernaut && theEthernaut.style) theEthernaut.style.filter = !this.state.dark
        ? svgFilter()
        : null;

      // Change Arrow
      let isArrowInPage = document.getElementById("arrow");
      if (isArrowInPage && isArrowInPage.style)
        isArrowInPage.style.filter = !this.state.dark ? svgFilter() : null;

      // Change Mosaic and levels logo
      let elements = document.getElementsByClassName("level-tile");
      for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        if (element && element.style) element.style.filter = !this.state.dark ? svgFilter() : null;
      }

      // Change all custom images
      elements = document.getElementsByClassName("custom-img");
      for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        if (element && element.style) element.style.filter = !this.state.dark ? svgFilter() : null;
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
              {/* <img
                id="christmas-hat"
                className="christmas-hat"
                src="../../imgs/christmas-hat.png"
                alt="christmas-hat"
              /> */}
              <img
                id="logo"
                className="logo"
                src="../../imgs/oz-logo.svg"
                alt="logo"
              />
            </a>
            <ul className="header-ul">
              {
                window.location.pathname === constants.PATH_ROOT && this.state.chainId!==0 &&
                  <Link to={constants.PATH_LEADERBOARD}>
                    <LeaderIcon />
                  </Link>
              }
              <li className="nav-links">
                <Link
                  to={
                    window.location.pathname !== constants.PATH_ROOT
                      ? constants.PATH_ROOT
                      : constants.PATH_HELP
                  }
                >
                  <button>
                    {window.location.pathname !== constants.PATH_ROOT ? (
                      <i className="fas fa-home"></i>
                    ) : (
                      <i className="fas fa-question"></i>
                    )}
                  </button>
                </Link>
              </li>
              <li className="dropdown">
                <div className="icon-buttons" href="/">
                  <i className="fas fa-globe-americas"></i>
                </div>
                <div className="dropdown-content">
                  <a
                    onClick={(e) => {
                      this.changeLanguage(e,"en");
                    }}
                    href="/"
                  >
                    {strings.english}
                  </a>
                  <a
                    onClick={(e) => {
                      this.changeLanguage(e,"es");
                    }}
                    href="/"
                  >
                    {strings.spanish}
                  </a>
                  <a
                    onClick={(e) => {
                      this.changeLanguage(e,"pt_br");
                    }}
                    href="/"
                  >
                    {strings.portuguese}
                  </a>
                  <a
                    onClick={(e) => {
                      this.changeLanguage(e,"ja");
                    }}
                    href="/"
                  >
                    {strings.japanese}
                  </a>
                  <a
                    onClick={(e) => {
                      this.changeLanguage(e,"zh_cn");
                    }}
                    href="/"
                  >
                    {strings.chinese_simplified}
                  </a>
                  <a
                    onClick={(e) => {
                      this.changeLanguage(e,"zh_tw");
                    }}
                    href="/"
                  >
                    {strings.chinese_traditional}
                  </a>
                  <a
                    onClick={(e) => {
                      this.changeLanguage(e,"fr");
                    }}
                    href="/"
                  >
                    {strings.french}
                  </a>
                  <a
                    onClick={(e) => {
                      this.changeLanguage(e,"ru");
                    }}
                    href="/"
                  >
                    {strings.russian}
                  </a>
                  <a
                    onClick={(e) => {
                      this.changeLanguage(e,"ar");
                    }}
                    href="/"
                  >
                    {strings.arabic}
                  </a>
                  <a
                    onClick={(e) => {
                      this.changeLanguage(e,"tr");
                    }}
                    href="/"
                  >
                    {strings.turkish}
                  </a>
                  <a
                    className="contr"
                    href="https://github.com/openzeppelin/ethernaut#modify-or-add-new-languages"
                  >
                    {strings.contributeTranslation}
                  </a>
                </div>
              </li>
              {this.props.web3 && <li className="dropdown chains">
                <div className="icon-buttons" href="/">
                  <i className="fas fa-network-wired"></i>
                </div>
                <div className="dropdown-content">
                  {Object.values(constants.NETWORKS_INGAME).map((network) => {
                    if (
                      network &&
                      network.name !== 'local'
                    ) {
                      if (Number(network.id) === this.state.chainId) return false; // filter out current network
                      return (
                        <a id={network.name} key={network.name}
                          onClick={(e) => {
                            e.preventDefault();

                            async function changeNetwork() {
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
                                    if (addError.code === 4001) {
                                      //User has rejected changing the request
                                      elements[0].style.display = 'none';
                                    }
                                    console.error("Can't add nor switch to the selected network")
                                  }
                                } else if (switchError.code === 4001) {
                                  //User has rejected changing the request
                                  elements[0].style.display = 'none';
                                }
                              }
                            }

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
              </li>}
              <input
                onClick={() => {
                  this.toggleDarkMode();
                }}
                className="toggle"
                type="checkbox"
              />
            </ul>
          </header>
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
          {!this.props.web3 &&
            <div style={{ backgroundColor: "#eddfd6", border: "none" }} class="alert alert-warning">
              <strong>{strings.warning}! </strong><span>{strings.warningMessage}</span>
            </div>}
        </center>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { web3: state.network.web3, allLevelsCompleted: state.player.allLevelsCompleted };
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