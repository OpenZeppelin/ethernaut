import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MarkdownComponent from '../components/Markdown'
import { loadTranslations } from '../utils/translations'
import Header from './Header';

class Help extends React.Component {
  
  render() {
    let language = localStorage.getItem('lang')
    let strings = loadTranslations(language)

    var newColor = hexToRgb('#eddfd6');

    // document.body.style.backgroundColor = 'black';

    return (
      <div>
        <Header></Header>
        <main className="boxes">
          <section>
          
          <h3>Game Mechanics</h3>
          
          <MarkdownComponent target={strings.gameMechanics} />

          </section>
          <section className="emptySection">
      
          </section >
          <section>

          <h3>Using the console</h3>
          
          <MarkdownComponent target={strings.usingConsole} />

          </section>
          
          <section className="emptySection">
      
          </section>

          <section>

          <h3>Beyond the console</h3>
          
          <MarkdownComponent target={strings.beyondConsole} />

          </section>
          <section className="emptySection">
      
          </section>
          <section>

          <h3>Troubleshooting</h3>

          <MarkdownComponent target={strings.troubleshooting} />  

          </section>
        </main>
      </div>)
}}

function mapStateToProps(state) {
  return {
    language: state.lang
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? "rgb(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ")" : null;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Help)