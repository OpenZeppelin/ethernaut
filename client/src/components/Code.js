import React from 'react'
import Highlight from 'react-highlight'
import loadText from '../utils/textloader'

import 'highlight.js/styles/atom-one-dark.css'

class Code extends React.Component {

  constructor() {
    super()
    this.state = {
      target: undefined,
      source: undefined
    }
  }

  componentDidMount() {
    this.loadContents(this.props.target)
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  async componentDidUpdate(prevProps) {
    if (this.props.target !== prevProps.target) {
      this.loadContents(this.props.target);
    }
  }

  async loadContents(target) {
    if (!this._isMounted) return;
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
      <div>
        { this.state.source &&
        <Highlight className="solidity">
          {this.state.source}
        </Highlight>
        }
      </div>
    )
  }
}

export default Code
