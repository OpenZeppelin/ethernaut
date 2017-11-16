import * as ethutil from './ethutil'
import * as constants from '../constants'
import { createRainbow } from 'rainbow-color'
import { rgbaString } from 'color-map'

function interceptConsole() {

  // Replace console
  const logger = Object.assign({}, console);
  const defaultConsole = console;
  window.console = logger;

  // ----------------------------------
  // custom console API
  // ----------------------------------

  // LOG
  // logger.log = function(...args) {
  //   args = processArgs(args)
  //   if(args.length === 0) return
  //   defaultConsole.log(...args)
  // }
  if(!constants.DEBUG) {
    logger.log = function(...args) {} // KILL LOGS IN PRODUCTION
  }

  // DIR
  logger.dir = function(...args) {
    args = processArgs(args)
    if(args.length === 0) return
    defaultConsole.log(args[0])
  }

  // INFO
  logger.info = function(...args) {
    args = processArgs(args)
    if(args.length === 0) return
    defaultConsole.info(
      `%c${args}`,
      `color: rgba(255, 255, 255, 0.85); font-weight: bold; font-size: 14px; text-shadow: 3px 2px red; background: #006;`
    )
  }

  // ASYNC INFO
  logger.asyncInfo = function(...args) {
    args = processArgs(args)
    if(args.length === 0) return
    defaultConsole.info(
      `%c${args} %c<  < <<PLEASE WAIT>> >  >`,
      `color: rgba(255, 255, 255, 0.85); font-weight: bold; font-size: 14px; text-shadow: 3px 2px red; background: #006;`,
      `color: rgba(255, 0, 0, 0.85); font-family: monospace; font-weight: bold; font-size: 18px; text-shadow: 3px 2px white; background: #00f;`,
    )
  }

  // GREET
  logger.greet = function(...args) {
    args = processArgs(args)
    if(args.length === 0) return
    defaultConsole.info(
      `%c${args}`,
      `background-color: #222; font-family: monospace; font-weight: bold; font-size: 36px; color: white; text-shadow: 3px 3px 0 rgb(217, 31, 38), 5px 5px 0 rgb(226, 91, 14), 7px 7px 0 rgb(245, 221, 8), 9px 9px 0 rgb(5, 148, 68), 11px 11px 0 rgb(2, 135, 206), 13px 13px 0 rgb(4, 77, 145), 15px 15px 0 rgb(42, 21, 113)`
    )
  }

  // VICTORY
  logger.victory = function(msg1, msg2) {
    msg1 = processArgs([msg1])
    msg2 = processArgs([msg2])
    let c = 0
    const m = 20
    const s = 20
    const rainbow = createRainbow(m)
    const interval = setInterval(() => {
      const rawColor = rainbow[c]
      const color = rgbaString(rawColor)
      defaultConsole.info(
        `%c${msg1}`,
        `color: rgba(0, 0, 0, 0);
         font-family: monospace;
         font-weight: bold;
         font-size: ${Math.floor(20 * (c / m))}px;
         -webkit-text-stroke-width: 1px;
         -webkit-text-stroke-color: ${color};`)
        c++;
        if(c >= m) {
          clearInterval(interval)
          console.greet(msg2)
        }
    }, s)
  }

  // ERROR
  logger.error = function(...args) {
    args = processArgs(args)
    if(args.length === 0) return
    defaultConsole.error(
      `%c${args}`,
      `background-color: #622; color: #f00; font-family: monospace; font-weight: bold; font-size: 18px;`
    )
  }

  // WARN
  logger.warn = function(...args) {
    args = processArgs(args)
    if(args.length === 0) return
    defaultConsole.warn(
      `%c${args}`,
      `background-color: #662; color: #ff0; font-family: monospace; font-weight: bold;`
    )
  }

  // SECRET
  logger.secret = function(...args) {
    args = processArgs(args)
    if(args.length === 0) return
    defaultConsole.info(
      `%c${args}`,
      `background-color: #262; color: #0f0; font-family: monospace; font-weight: bold;`
    )
  }
  logger.quiet = function(...args) {
    args = processArgs(args)
    if(args.length === 0) return
    defaultConsole.info(
      `%c${args}`,
      `background-color: #333; color: #666; font-family: monospace; font-weight: bold; font-size: 10;`
    )
  }

  // MINE
  logger.mineInfo = function(text, txId) {
    const color = stringToColor(txId)
    const negColor = invertColor(color)
    defaultConsole.info(
      `%c⛏️ ${text} ⛏%c`,
      `color: ${negColor}; font-weight: bold; font-size: 12px; background-color: ${color};`,
      "",
      `https://${constants.ACTIVE_NETWORK.name}.etherscan.io/tx/${txId}`
    )
  }

  // FILTER LOGGING
  function processArgs(args) {
    for(let i = 0; i < args.length; i++) {

      let arg = args[i]
      const isString = typeof arg === 'string'

      // Filter annoying warnings
      if(isString && arg.indexOf('web3 will be deprecated') !== -1) return []
      if(isString && arg.indexOf('Accessing PropTypes via') !== -1) return []
      if(isString && arg.indexOf('Slow network is detected.') !== -1) return []

      // Icons
      if(isString) {
        arg = arg.replace(new RegExp('@good', 'g'), randGoodIcon())
        arg = arg.replace(new RegExp('@bad', 'g'), randBadIcon())
        args[i] = arg
      }
    }
    return args
  }

  // ----------------------------------
  // Utils
  // ----------------------------------

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  function stringToColor(str) {
    let hash = hashString(str);
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }

  function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    // invert color components
    let r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
      g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
      b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
  }

  function padZero(str, len) {
    len = len || 2;
    let zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }
}
if(constants.CUSTOM_LOGGING) interceptConsole()

// Setup console utils
function setupConsoleUtils() {
  window.getBalance = ethutil.getBalance
  window.getBlockNumber = ethutil.getBlockNumber
  window.sendTransaction = ethutil.sendTransaction
  window.getNetworkId = ethutil.getNetworkId
  window.toWei = ethutil.toWei
  window.fromWei = ethutil.fromWei
  window.version = constants.VERSION
  window.contract = `No contract set, go to a level and click 'Get new instance'`
  window.help = function() {
    console.table({
      'player': 'current player address',
      'ethernaut': 'main game contract',
      'level': 'current level contract address',
      'contract': 'current level contract instance (if created)',
      'instance': 'current level instance contract address (if created)',
      'version': 'current game version',
      'getBalance(address)': 'gets balance of address in ether',
      'getBlockNumber()': 'gets current network block number',
      'sendTransaction({options})': 'send transaction util',
      'getNetworkId()': 'get ethereum network id',
      'toWei(ether)': 'convert ether units to wei',
      'fromWei(wei)': 'convert wei units to ether',
    })
  }
}
setupConsoleUtils()

const ICONS_BAD = [
  '(╯°□°）╯',
  '<|º감º|>',
  '╰(◣﹏◢)╯',
  '༼ つ ◕_◕ ༽つ',
  '\\(°□°)/',
  '(•̪●)',
  '*¬*',
  '̿ ̿’ ̿’\\̵͇̿̿\\з=(•̪●)=ε/̵͇̿̿/’̿”̿ ',
  'ヽ(`Д´)ﾉ',
  '\\˚ㄥ˚\\',
  '(✖╭╮✖)',
  '(•̪̀●́)=ε/̵͇̿̿/’̿̿ ̿ ̿̿',
  '(Ͼ˳Ͽ)..!!!̿̿̿',
  '(⋟﹏⋞)',
  'ε(´סּ︵סּ`)з',
  '¯\\_(ツ)_/¯ ',
  '‹’’›(Ͼ˳Ͽ)‹’’›   ',
  '(╯°□°)--︻╦╤─ - - - ',
  '(c ͡|Q ͜ʖ ͡o)╦╤─',
  '(-_- ;)',
  '/-.-\\',
  '( ͡ °~͡° )',
  'ლ(́◕◞Ѿ◟◕‵ლ)',
  'ヽ(´o｀；',
  '(◢_◣)'
]
const ICONS_GOOD = [
  '◕_◕',
  'ˁ(⦿ᴥ⦿)ˀ',
  '◖(◣☩◢)◗',
  '龴ↀ◡ↀ龴',
  '| – _ – |',
  '‘(◣_◢)’',
  'd[ o_0 ]b',
  '龴ↀ◡ↀ龴',
  '|[●▪▪●]|',
  '^⨀ᴥ⨀^',
  '⦿⽘⦿',
  '⎦˚◡˚⎣',
  '(-(-_(-_-)_-)-)',
  '(◔/‿\\◔)',
  'O=(\'-\'Q)',
  't(-.-t)',
  '<>_<>',
  '\\,,/(◣_◢)\\,,/',
  'ᕦ(ò_óˇ)ᕤ',
  '╚(▲_▲)╝',
  '(‾⌣‾)',
  '( ͡° ͜ʖ ͡°)',
  '⊂(✰‿✰)つ',
  '(⌐■_■)',
  '☚ (<‿<)☚',
  '٩(^‿^)۶',
  '☜Ҩ.¬_¬.Ҩ☞',
  '(っ◕‿◕)っ',
  '≧◔◡◔≦',
  '٩(- ̮̮̃-̃)۶',
  '\\(ˆ˚ˆ)/',
  '【ツ】',
  '٩(- ̮̮̃-̃)۶',
  '=^..^=',
  '•|龴◡龴|•',
  '✌(◕‿-)✌',
  '／人 ⌒ ‿‿ ⌒ 人＼',
  '☚ (<‿<)☚',
  'ʕ•̫͡•ʕ*̫͡*ʕ•͓͡•ʔ-̫͡-ʕ•̫͡•ʔ*̫͡*ʔ-̫͡-ʔ',
  'ヽ(￣(ｴ)￣)ﾉ',
  '(●*∩_∩*●)',
  '♪└(￣◇￣)┐♪└(￣◇￣)┐♪└(￣◇￣)┐♪'
]
function randInt(min, max) { return Math.floor((max - min) * Math.random()) + min }
function randBadIcon() { return ICONS_BAD[randInt(0, ICONS_BAD.length)] }
function randGoodIcon() { return ICONS_GOOD[randInt(0, ICONS_GOOD.length)] }