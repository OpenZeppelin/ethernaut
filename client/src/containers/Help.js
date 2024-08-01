import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MarkdownComponent from "../components/common/Markdown";
import { loadTranslations } from "../utils/translations";
import Footer from "../components/common/Footer";
import { Helmet } from 'react-helmet';

class Help extends React.Component {
  render() {
    let language = localStorage.getItem("lang");
    let strings = loadTranslations(language);

    return (
      <div className="helpcontainer main-wrapper">
       <Helmet>
          <title>The Ethernaut - Help</title>
          {/* <!-- Primary Meta Tags --> */}
          <meta name="title" content="The Ethernaut - Help" />
          <meta
            name="description"
            content="Web3/Solidity based wargame played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'. - Help"
          />
          {/* <!-- Open Graph / Facebook --> */}
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content="https://ethernaut.openzeppelin.com/help"
          />
          <meta property="og:title" content="The Ethernaut - Help" />
          <meta
            property="og:description"
            content="Web3/Solidity based wargame played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'. - Help"
          />
          <meta
            property="og:image"
            content="https://ethernaut.openzeppelin.com/imgs/metatag.png"
          />
          {/* <!-- Twitter --> */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@OpenZeppelin" />
          <meta name="twitter:title" content="The Ethernaut - Help" />
          <meta
            name="twitter:description"
            content="Web3/Solidity based wargame played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'. - Help"
          />
          <meta
            name="twitter:image"
            content="https://ethernaut.openzeppelin.com/imgs/metatag.png"
          />
        </Helmet>
 
        <div className="lines"></div>
        <main className="boxes">
          <h3>Setup Metamask</h3>
          <section>
            <MarkdownComponent target={strings.setupMetamask} />
          </section>

          <h3>Game Mechanics</h3>
          <section>
            <MarkdownComponent target={strings.gameMechanics} />
          </section>

          <h3>Using the console</h3>
          <section>
            <MarkdownComponent target={strings.usingConsole} />
          </section>

          <h3>Beyond the console</h3>
          <section>
            <MarkdownComponent target={strings.beyondConsole} />
          </section>

          <h3>Troubleshooting</h3>
          <section>
            <MarkdownComponent target={strings.troubleshooting} />
          </section>
        </main>
        {/* Footer */}
        <Footer></Footer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.lang,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Help);
