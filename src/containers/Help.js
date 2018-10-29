import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MarkdownComponent from '../components/Markdown'

class Help extends React.Component {
  render() {
    let file = null
    let language = window.lang || 'en'
    try { file = require(`../../gamedata/${language}/descriptions/pages/help.md`) } catch(e){}
    return (
      <div className="page-container">
        <h2 className="title">Ethernaut Help</h2>
        { file && <MarkdownComponent target={file}/> }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Help)