import { Page, PageTitle } from '../ui';

import MarkdownComponent from './Markdown';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Help extends React.Component {
  render() {
    let file = null;
    try {
      file = require(`../../gamedata/descriptions/pages/help.md`);
    } catch (e) {}
    return (
      <Page>
        <PageTitle>Ethernaut Help</PageTitle>
        {file && <MarkdownComponent target={file} />}
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Help);
