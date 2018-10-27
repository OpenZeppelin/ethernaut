require('dotenv').config({silent: true});

export const DEBUG = process.env.NODE_ENV !== 'production'
export const DEBUG_REDUX = DEBUG

// Networks
export const NETWORKS = {
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
    url: `http://${process.env.ROPSTEN_HOST}`,
    port: 8565,
  }
}

// Web3
export const Web3 = require("web3")

// Misc
export const CLEAR_CONSOLE = !DEBUG
export const GOOGLE_ANALYTICS_ID = 'UA-85043059-4'

// Owner addresses
export const ADDRESSES = {
  [NETWORKS.LOCAL.name]: undefined,
  [NETWORKS.ROPSTEN.name]: '0x1663fcb2f6566723a4c429f8ed34352726680f9a'
}

// Storage
export const VERSION = require('../package.json').version
export const STORAGE_PLAYER_DATA_KEY = `ethernaut_player_data_${VERSION}_`

// Paths
export const PATH_ROOT = '/'
export const PATH_NOT_FOUND = '/404'
export const PATH_HELP = '/help'
export const PATH_LEVEL_ROOT = `${PATH_ROOT}level/`
export const PATH_LEVEL = `${PATH_LEVEL_ROOT}:address`
export const PATH_STATS = `${PATH_ROOT}stats`

// RELEASE SENSITIVE
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
export const CUSTOM_LOGGING = true                              /* TRUE on production */
export const SHOW_ALL_COMPLETE_DESCRIPTIONS = false             /* FALSE on production */
export const SHOW_VERSION = true                                /* TRUE on production */
export const ACTIVE_NETWORK = NETWORKS.ROPSTEN
// export const ACTIVE_NETWORK = NETWORKS.LOCAL
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
