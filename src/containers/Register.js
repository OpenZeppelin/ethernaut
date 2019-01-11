import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MarkdownComponent from "../components/Markdown";

class Register extends React.Component {
  render() {
    let file = null;
    try {
      file = require(`../../gamedata/descriptions/pages/register.md`);
    } catch (e) {}
    return (
      <div className="page-container">
        <h2 className="title">Register</h2>
        {file && <MarkdownComponent target={file} />}
        <h2 className="title">Registration Form</h2>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScD3AlHziKg8uv0OYYeqLc4Ufd8VV8rsKyhvOuLWCeNj3P62A/viewform?embedded=true"
          width="100%"
          height="1047"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
        >
          Loading...
        </iframe>
      </div>
    );
  }
}

function mapStateToProps(_state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
