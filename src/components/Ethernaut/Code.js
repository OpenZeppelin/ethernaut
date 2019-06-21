import 'highlight.js/styles/atom-one-dark.css';

import Highlight from 'react-highlight';
import React from 'react';
import loadText from '../../utils/textloader';

class Code extends React.Component {
  state = {
    target: null,
    source: null,
  };

  componentDidMount() {
    this.loadContents(this.props.target);
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps(nextProps) {
    this.loadContents(nextProps.target);
  }

  loadContents(target) {
    if (this.state.target === target) return;
    loadText(target)
      .then((text) => {
        if (!this._isMounted) return;
        this.setState({
          target: target,
          source: text,
        });
      })
      .catch(this.setState({ source: null }));
  }

  render() {
    return (
      <div>
        {this.state.source && (
          <Highlight className="solidity">{this.state.source}</Highlight>
        )}
      </div>
    );
  }
}

export default Code;
