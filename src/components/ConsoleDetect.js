import DevToolsDetect from 'devtools-detect';
import React from 'react';

class ConsoleDetect extends React.Component {
  constructor() {
    super();
    this.state = {
      consoleIsOpen: !DevToolsDetect.open,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.checkConsole();
    });
    this.checkConsole();
    setInterval(() => this.checkConsole(), 500);
  }

  checkConsole() {
    const isOpen = DevToolsDetect.open;
    if (this.state.consoleIsOpen !== isOpen) {
      this.setState({
        consoleIsOpen: isOpen,
      });
    }
  }

  render() {
    if (this.state.consoleIsOpen === true) return null;
    return (
      <span style={{ fontSize: '0.8rem' }} className="text-muted">
        OPEN YOUR CONSOLE TO PLAY
      </span>
    );
  }
}

export default ConsoleDetect;
