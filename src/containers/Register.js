import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MarkdownComponent from "../components/Markdown";

const netlify = { "data-netlify": "true" };

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
        <form name="contact" method="POST" {...netlify}>
          <input type="hidden" name="form-name" value="contact" />
          <div className="form-group">
            <label>Ethereum Address*:</label>
            <input
              type="text"
              name="address"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Name*:</label>
            <input type="text" name="name" className="form-control" required />
          </div>
          <div className="form-group">
            <label>Contact Number:</label>
            <input type="text" name="contact" className="form-control" />
          </div>
          <div className="form-group">
            <label>Email*:</label>
            <input
              type="email"
              name="email"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Email Signature*:</label>
            <input
              type="text"
              name="email-signature"
              className="form-control"
              placeholder="See instructions above on signing email address"
              required
            />
          </div>
          <div className="text-right">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
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
