import DevToolsDetect from 'devtools-detect';
import React from 'react';

class ConsoleDetect extends React.Component {
  state = {
    consoleIsOpen: !DevToolsDetect.open,
  };

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
    console.log(this.state);
    if (this.state.consoleIsOpen === true) return null;
    return <span />;
  }
}

export default ConsoleDetect;
