import React from "react";
import onClickOutside from 'react-onclickoutside'
import { connect } from "react-redux";
import { withRouter } from "../hoc/withRouter";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as actions from "../actions";
import * as constants from "../constants";
import { loadTranslations } from "../utils/translations";
import PropTypes from "prop-types";
import { ProgressBar } from "react-loader-spinner";
import { svgFilter } from "../utils/svg";
import LeaderIcon from "../components/leaderboard/LeaderIcon";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dark: false,
      lang: localStorage.getItem("lang"),
      chainId: 0,
      activeDropdown: null,
      multiDDOpen: false,
    };

    if (this.props.web3) {
      window.ethereum.request({ method: "eth_chainId" }).then((id) => {
        this.setState({ chainId: Number(id) });
      });
    }
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  setActiveTab(tabIndex) {
    const { activeDropdown } = this.state;
    const newState =
      activeDropdown === tabIndex && activeDropdown ? null : tabIndex;
    this.setState({ activeDropdown: newState });
  }

  getDDClassName(tabdcurrentTabIndex) {
    const { activeDropdown } = this.state;
    const className = tabdcurrentTabIndex === activeDropdown ? "show" : "hide";
    return className;
  }

  toggleDropdownState() {
    this.setState({
      multiDDOpen: !this.state.multiDDOpen,
    });
  }

  closeDropdown() {
    if (!this.state.multiDDOpen) return;
    this.setState({
      multiDDOpen: false,
    });
  }

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
          if (element && element.style)
            element.style.filter = this.state.dark ? svgFilter() : null;
        }
      }

      // Change The Ethernaut logo
      var theEthernaut = document.getElementById("the-ethernaut");
      if (theEthernaut && theEthernaut.style)
        theEthernaut.style.filter = this.state.dark ? svgFilter() : null;

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
          if (element && element.style)
            element.style.filter = this.state.dark ? svgFilter() : null;
        }
      }
    }
  }

  changeLanguage(e, value) {
    e.preventDefault();
    this.props.setLang(value);
  }

  async changeNetwork(network) {
    const elements = document.querySelectorAll(".progress-bar-wrapper");
    elements[0].style.display = "flex";
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (Number(chainId) === Number(network.id)) {
        return;
      }
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: `0x${Number(network.id).toString(16)}`,
          },
        ],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${Number(network.id).toString(16)}`,
                chainName: network.name,
                rpcUrls: [network.rpcUrl],
                nativeCurrency: {
                  name: network.currencyName,
                  symbol: network.currencySymbol,
                  decimals: 18,
                },
                blockExplorerUrls: [network.blockExplorer],
              },
            ],
          });
        } catch (addError) {
          if (addError.code === 4001) {
            //User has rejected changing the request
            elements[0].style.display = "none";
          }
          console.error("Can't add nor switch to the selected network");
        }
      } else if (switchError.code === 4001) {
        //User has rejected changing the request
        elements[0].style.display = "none";
      }
    }
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
      var theLogo = document.getElementById("logo");
      if (theLogo && theLogo.style)
        theLogo.style.filter = !this.state.dark ? svgFilter() : null;

      // // Change OpenZeppelin logo
      // var theChristmashat = document.getElementById("christmas-hat")
      // if (theChristmashat && theChristmashat.style) theChristmashat.style.filter = !this.state.dark
      //   ? svgFilter()
      //   : null;

      // Change The Ethernaut logo
      var theEthernaut = document.getElementById("the-ethernaut");
      if (theEthernaut && theEthernaut.style)
        theEthernaut.style.filter = !this.state.dark ? svgFilter() : null;

      // Change Arrow
      let isArrowInPage = document.getElementById("arrow");
      if (isArrowInPage && isArrowInPage.style)
        isArrowInPage.style.filter = !this.state.dark ? svgFilter() : null;

      // Change Mosaic and levels logo
      let elements = document.getElementsByClassName("level-tile");
      for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        if (element && element.style)
          element.style.filter = !this.state.dark ? svgFilter() : null;
      }

      // Change all custom images
      elements = document.getElementsByClassName("custom-img");
      for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        if (element && element.style)
          element.style.filter = !this.state.dark ? svgFilter() : null;
      }

      this.setState({
        dark: !this.state.dark,
      });
    }
  }

  handleClickOutside = () => {
    this.closeDropdown();
  }

  render() {
    let strings = loadTranslations(this.state.lang);

    const LANGUAGES_MAP = {
      en: strings.english,
      es: strings.spanish,
      pt_br: strings.portuguese,
      ja: strings.japanese,
      zh_cn: strings.chinese_simplified,
      zh_tw: strings.chinese_traditional,
      fr: strings.french,
      ru: strings.russian,
      ar: strings.arabic,
      tr: strings.turkish,
    };
    
    const ddOpen = Boolean(this.state.multiDDOpen);
    return (
      <div onClick={() => this.closeDropdown()}>
        <div>

          <section className="descriptors">
            <div className="boxes author-section-border" style={{marginTop: '0', marginBottom: '0', width: '100%'}}>
              <div className="author-section text-center" style={{marginLeft: '0', marginBottom: '0', width: 'auto'}}>
                <div style={{overflowWrap: 'anywhere'}}>
    
                  <span style={{fontSize: 'larger'}}>
                  <strong>
                  Announcing Ethernaut CTF:</strong> A 48-hour capture the flag event with prizes and blockchain challenges, starting 16/03.

                  <a
                    className="buttons hiring-button"
                    href="https://ctf.openzeppelin.com"
                    style={{marginLeft: '0.5rem'}}
                  >
                    <button>{strings.ctfRegister}</button>
                  </a>
                
                </span>
    
                </div>
              </div>
            </div>
          </section>
        </div>
        <center>
          <header>
            <ul className="header-ul">
              <li key={"hiring"} className="nav-links">
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
            {/* ---- Multi Dropdown Container */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="multi-dropdown"
            >
              {/* dropdown icon */}
              <div
                onClick={() => this.toggleDropdownState()}
                className="multi-dropdown__icon"
              >
                <i className="fas fa-bars"></i>
              </div>
              {/* dropdown icon */}
              {/* dropdown content */}
              <ul
                className={`multi-dropdown__dropdown ${
                  ddOpen ? "--open" : "--closed"
                }`}
              >
                <div className="dropdown-pill --left">
                  <div>
                    <div onClick={() => this.toggleDropdownState()}>
                      <Link
                        to={
                          window.location.pathname !== constants.PATH_ROOT
                            ? constants.PATH_ROOT
                            : constants.PATH_HELP
                        }
                      >
                        <div className="filled-icon">
                          {window.location.pathname !== constants.PATH_ROOT ? (
                            <>
                              <i className="fas fa-home"></i>
                            </>
                          ) : (
                            <>
                              <i className="fas fa-question"></i>
                            </>
                          )}
                        </div>
                      </Link>
                    </div>
                    {window.location.pathname === constants.PATH_ROOT &&
                      !!this.props.web3 && (
                        <Link   onClick={() => this.toggleDropdownState()}
                        to={constants.PATH_LEADERBOARD}>
                          <div
                          className="element-in-row filled-icon">                                
                                <LeaderIcon />
                          </div>
                        </Link>
                        
                      )}
                    <input
                      onClick={() => {
                        this.toggleDarkMode();
                      }}
                      className="element-in-row toggle --small"
                      type="checkbox"
                    />
                  </div>
                </div>

                <div
                  className={`single-dropdown --${
                    this.props.web3 && "--hidden"
                  }`}
                >
                  <p onClick={() => this.setActiveTab(2)}>
                    <i className="fas fa-network-wired"></i>
                    <span>{strings.Networks}</span>
                  </p>
                  <div className={this.getDDClassName(2)}>
                    {Object.values(constants.NETWORKS_INGAME).map((network, index) => {
                      if (network && network.name !== "local") {
                        if (Number(network.id) === this.state.chainId)
                          return false; // filter out current network
                        return (
                          <div key={index}
                            onClick={(e) => {
                              e.preventDefault();
                              this.changeNetwork(network);
                            }}
                            className="dropdown-pill"
                          >
                            <a id={network.name} key={network.name} href="/">
                              {network.name}
                            </a>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                <div className="single-dropdown">
                  <p onClick={() => this.setActiveTab(1)}>
                    <i className="fas fa-globe-americas"></i>
                    <span>{strings.Languages}</span>
                  </p>
                  <div className={this.getDDClassName(1)}>
                    {Object.keys(LANGUAGES_MAP).map((languageString, index) => (
                      <div key={index}
                        onClick={(e) => {
                          this.changeLanguage(e, languageString);
                        }}
                        className="dropdown-pill"
                      >
                        <a href="/">{LANGUAGES_MAP[languageString]}</a>
                      </div>
                    ))}
                    <div className="dropdown-pill">
                      <a
                        className="contr"
                        href="https://github.com/openzeppelin/ethernaut#modify-or-add-new-languages"
                      >
                        {strings.contributeTranslation}
                      </a>
                    </div>
                  </div>
                </div>
              </ul>
              {/* dropdown content */}
            </div>
          </header>
          <ProgressBar
            height="100"
            width="100"
            borderColor={
              this.state.dark
                ? getComputedStyle(document.documentElement).getPropertyValue(
                    "--pink"
                  )
                : getComputedStyle(document.documentElement).getPropertyValue(
                    "--black"
                  )
            }
            barColor={
              this.state.dark
                ? getComputedStyle(document.documentElement).getPropertyValue(
                    "--pink"
                  )
                : getComputedStyle(document.documentElement).getPropertyValue(
                    "--black"
                  )
            }
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass="progress-bar-wrapper"
            visible={true}
          />
          {!this.props.web3 && (
            <div
              style={{ backgroundColor: "#eddfd6", border: "none" }}
              className="alert alert-warning"
            >
              <strong>{strings.warning}! </strong>
              <span>{strings.warningMessage}</span>
            </div>
          )}
        </center>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    web3: state.network.web3,
    allLevelsCompleted: state.player.allLevelsCompleted,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setLang: actions.setLang,
    },
    dispatch
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(onClickOutside(Header)));
