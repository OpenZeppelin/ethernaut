require('dotenv').config({ silent: true })

exports.DEBUG = process.env.NODE_ENV !== 'production'
exports.DEBUG_REDUX = this.DEBUG

// Networks
exports.NETWORKS = {
  UNDEFINED: undefined,
  LOCAL: {
    name: 'local',
    id: '*',
    url: 'http://localhost',
    port: 8545
  },
  ROPSTEN: {
    name: 'ropsten',
    id: '3',
    url: `${process.env.ROPSTEN_HOST}`,
    privKey: `${process.env.ROPSTEN_PRIV_KEY}`
  },
  RINKEBY: {
    name: 'rinkeby',
    id: '4',
    url: `${process.env.RINKEBY_HOST}`,
    privKey: `${process.env.RINKEBY_PRIV_KEY}`
  }
}

// Web3
exports.Web3 = require("web3")

// Misc
exports.CLEAR_CONSOLE = !this.DEBUG
exports.GOOGLE_ANALYTICS_ID = 'UA-85043059-4'

// Owner addresses
exports.ADDRESSES = {
  [this.NETWORKS.LOCAL.name]: undefined,
  [this.NETWORKS.ROPSTEN.name]: '0x09902A56d04a9446601a0d451E07459dC5aF0820',
  [this.NETWORKS.RINKEBY.name]: '0x09902A56d04a9446601a0d451E07459dC5aF0820'
}

// Storage
exports.VERSION = require('../package.json').version
exports.STORAGE_PLAYER_DATA_KEY = `ethernaut_player_data_${this.VERSION}_`

// Paths
exports.PATH_ROOT = '/'
exports.PATH_NOT_FOUND = '/404'
exports.PATH_HELP = '/help'
exports.PATH_LEVEL_ROOT = `${this.PATH_ROOT}level/`
exports.PATH_LEVEL = `${this.PATH_LEVEL_ROOT}:address`
exports.PATH_STATS = `${this.PATH_ROOT}stats`

// RELEASE SENSITIVE
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
exports.CUSTOM_LOGGING = true                              /* TRUE on production */
exports.SHOW_ALL_COMPLETE_DESCRIPTIONS = false             /* FALSE on production */
exports.SHOW_VERSION = true                                /* TRUE on production */
//    exports.ACTIVE_NETWORK = NETWORKS.ROPSTEN
//    exports.ACTIVE_NETWORK = NETWORKS.RINKEBY
exports.ACTIVE_NETWORK = this.NETWORKS.LOCAL
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
