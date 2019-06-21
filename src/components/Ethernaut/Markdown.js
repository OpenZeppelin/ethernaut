import React from 'react';
import ReactMarkdown from 'react-markdown';
import loadText from '../../utils/textloader';

class Markdown extends React.Component {
  constructor() {
    super();
    this.state = {
      target: null,
      source: null,
    };
  }

  async componentWillMount() {
    this._isMounted = true;
    await this.loadContents(this.props.target);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async componentWillReceiveProps(nextProps) {
    await this.loadContents(nextProps.target);
  }

  async loadContents(target) {
    if (!this._isMounted) return;
    if (this.state.target === target) return;
    try {
      const text = await loadText(target);
      this.setState({ target: target, source: text });
    } catch (error) {
      this.setState({ source: null });
    }
  }

  render() {
    const source = this.state.source;
    return (
      <div id="markdown-output">
        {source && <ReactMarkdown source={source} />}
      </div>
    );
  }
}

export default Markdown;
