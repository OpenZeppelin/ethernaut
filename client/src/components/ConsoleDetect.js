import React from 'react'
import DevToolsDetect from 'devtools-detect'
import { loadTranslations } from '../utils/translations'

class ConsoleDetect extends React.Component {

  constructor() {
    super()
    this.state = {
      consoleIsOpen: !DevToolsDetect.open
    }
  }

  componentDidMount() {
    window.addEventListener('resize', () => { this.checkConsole() })
    this.checkConsole()
    setInterval(() => this.checkConsole(), 500)
  }

  componentDidUpdate() {
    this.checkConsole()
    this.render()
  }

  checkConsole() {
    const isOpen = DevToolsDetect.isOpen
    if(this.state.consoleIsOpen !== isOpen) {
      this.setState({
        consoleIsOpen: isOpen
      })
    }
  }

  render() {
    if(this.state.consoleIsOpen === true) return null
    let language = localStorage.getItem('lang')
    let strings = loadTranslations(language)
    return (
      <span
        style={{fontSize: '12px'}}
        className="text-muted"
      >
        {strings.openConsole}
      </span>
    )
  }
}

export default ConsoleDetect