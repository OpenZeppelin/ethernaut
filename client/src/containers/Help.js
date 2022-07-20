import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MarkdownComponent from "../components/Markdown";
import { loadTranslations } from "../utils/translations";

class Help extends React.Component {
  render() {
    let language = localStorage.getItem("lang");
    let strings = loadTranslations(language);

    return (
      <div>
        <div className="lines"></div>
        <main className="boxes">
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
        <footer
          className="footer"
          dangerouslySetInnerHTML={{ __html: strings.footer }}
        ></footer>
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
