import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadTranslations } from "../../utils/translations";
import { randBadIcon } from "../../utils/^^";
import "../../styles/app.css";
import Footer from "../common/Footer";

class NotFound404 extends React.Component {
  render() {
    let language = localStorage.getItem("lang");
    let strings = loadTranslations(language);

    return (
      <div className="helpcontainer">
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
