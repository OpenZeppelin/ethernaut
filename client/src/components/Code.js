import React from 'react'
import loadText from '../utils/textloader'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import hljsDefineSolidity from 'highlightjs-solidity'
hljsDefineSolidity(hljs);

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
    this.highlightCode();
  }

  highlightCode() {
    const nodes = document.querySelectorAll('pre code');

    for (let i = 0; i < nodes.length; i++) {
        if(!nodes[i].className.includes('solidity')) return;
        hljs.highlightElement(nodes[i])
    }
  }

  async loadContents(target) {
    if (!this._isMounted) return;
    if(this.state.target === target) return
    try {
      const text = await loadText(target);
      this.setState({
        target: target,
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
      <pre><code className='solidity'>
        {this.state.source}
      </code></pre>
    )
  }
}

export default Code
