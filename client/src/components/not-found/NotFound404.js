import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadTranslations } from "../../utils/translations";
import { randBadIcon } from "../../utils/^^";
import "../../styles/app.css";
import Footer from "../common/Footer";
import { Helmet } from "react-helmet";

class NotFound404 extends React.Component {
  render() {
    let language = localStorage.getItem("lang");
    let strings = loadTranslations(language);

    return (
      <div className="helpcontainer">
        <Helmet>
          <title>The Ethernaut - Not Found 404</title>
          {/* <!-- Primary Meta Tags --> */}
          <meta name="title" content="The Ethernaut - Not Found 404" />
          <meta
            name="description"
            content="Web3/Solidity based wargame played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'. - Not Found 404"
          />
          {/* <!-- Open Graph / Facebook --> */}
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content="https://ethernaut.openzeppelin.com/404"
          />
          <meta property="og:title" content="The Ethernaut - Not Found 404" />
          <meta
            property="og:description"
            content="Web3/Solidity based wargame played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'. - Not Found 404"
          />
          <meta
            property="og:image"
            content="https://ethernaut.openzeppelin.com/imgs/metatag.png"
          />
          {/* <!-- Twitter --> */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@OpenZeppelin" />
          <meta name="twitter:title" content="The Ethernaut - Not Found 404" />
          <meta
            name="twitter:description"
            content="Web3/Solidity based wargame played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'. - Not Found 404"
          />
          <meta
            name="twitter:image"
            content="https://ethernaut.openzeppelin.com/imgs/metatag.png"
          />
        </Helmet>
        <div className="lines"></div>
        <main className="page-not-found-container">
          <h1>{randBadIcon()}</h1>
          <h3 className="page-not-found-title">{strings.PageNotFoundTitle}</h3>
          <h4 className="page-not-found-text">{strings.PageNotFoundText}</h4>
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

export default connect(mapStateToProps, mapDispatchToProps)(NotFound404);
