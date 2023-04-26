import React from 'react'
import loadText from '../../utils/textloader'
import 'highlight.js/styles/vs2015-css.mjs'
import hljs from 'highlight.js'

class Code extends React.Component {

  constructor() {
    super()
    this.state = {
      target: undefined,
      source: undefined
    }
  }

  async componentDidMount() {
    this._isMounted = true
    await this.loadContents(this.props.target)
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  async componentDidUpdate(prevProps) {
    await this.loadContents(this.props.target);
  }

  getHighlightedCode() {
    if (this.state.source) {
      return {
        __html: hljs.highlight(this.state.source, { language: 'solidity' }).value,
      };
    }
  }

  async loadContents(target) {
    if (!this._isMounted) return;
    let targetText = typeof target == 'string' ? target : target.default;
    if(this.state.target === targetText) return
    try {
      const text = await loadText(targetText);
      this.setState({
        target: targetText,
        source: text,
      });
    } catch (e) {
      this.setState({
        source: undefined,
      });
    }
  }

  render() {
    return (
      <pre><code className='hljs' dangerouslySetInnerHTML={this.getHighlightedCode()}></code></pre>
    )
  }
}

export default Code
