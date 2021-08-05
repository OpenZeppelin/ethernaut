import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MarkdownComponent from '../components/Markdown'
import { loadTranslations } from '../utils/translations'

class Help extends React.Component {
  render() {
    let file = null
    let language = localStorage.getItem('lang')
    let strings = loadTranslations(language)
    try { 
      file = require(`../gamedata/${language}/descriptions/pages/help.md`)
    } catch(e){
      file = require(`../gamedata/en/descriptions/pages/help.md`)
    }
    return (
      <div className="page-container">
        <h2 className="title">{strings.ethernautHelp}</h2>
        { file && <MarkdownComponent target={file}/> }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    language: state.lang
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Help)