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

  componentWillReceiveProps(nextProps) {
    this.loadContents(nextProps.target)
  }

  loadContents(target) {
    if(this.state.target === target) return
    loadText(target)
      .then(text => {
        if(!this._isMounted) return
        this.setState({
          target: target,
          source: text
        })
      })
      .catch(this.setState({source: undefined}))
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