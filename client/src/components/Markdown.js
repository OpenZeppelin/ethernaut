import React from 'react'
import ReactMarkdown from 'react-markdown'
import loadText from '../utils/textloader'

class Markdown extends React.Component {

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

  async componentDidUpdate() {
    await this.loadContents(this.props.target);
  }

  async loadContents(target) {
    if(!this._isMounted) return
    if(this.state.target === target) return
    try {
      const text = /md?$/.test(target) ?  await loadText(target) : target;
      this.setState({ target: target, source: text })
    } catch(error) {
      this.setState({source: undefined})
    }
  }

  render() {
    const children = this.state.source;
    return <div>{ children && <ReactMarkdown children={children}/> }</div>
  }
}

export default Markdown
