import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MarkdownComponent from '../components/Markdown'
import RandomImage from '../components/RandomImage'

class About extends React.Component {
  render() {
    let file = null
    try { file = require(`../../gamedata/descriptions/pages/about.md`) } catch(e){}
    return (
      <div className="page-container">
        { file && <MarkdownComponent target={file}/> }
        <RandomImage/>
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
)(About)