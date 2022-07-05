import dotenv from 'dotenv';
import pkgWeb3 from 'web3';
import * as pkgJSON from '../package.json';
dotenv.config()

export const DEBUG = process.env.NODE_ENV !== 'production'
export const DEBUG_REDUX = DEBUG
export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN

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
export const Web3 = pkgWeb3;

// Misc
export const CLEAR_CONSOLE = !DEBUG
export const GOOGLE_ANALYTICS_ID = 'UA-85043059-4'

// Owner addresses
export const ADDRESSES = {
  [NETWORKS.LOCAL.name]: undefined,
  [NETWORKS.ROPSTEN.name]: '0x09902A56d04a9446601a0d451E07459dC5aF0820',
  [NETWORKS.RINKEBY.name]: '0x09902A56d04a9446601a0d451E07459dC5aF0820'
}

// Storage
export const VERSION = pkgJSON.default.version
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
export const ACTIVE_NETWORK = NETWORKS.RINKEBY
// export const ACTIVE_NETWORK = NETWORKS.ROPSTEN
// export const ACTIVE_NETWORK = NETWORKS.LOCAL
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
