export const CONNECT_WEB3 = "CONNECT_WEB3";
export const connectWeb3 = web3 => ({ type: CONNECT_WEB3, web3 })

export const SET_GAS_PRICE = "SET_GAS_PRICE";
export const setGasPrice = gasPrice => ({ type: SET_GAS_PRICE, gasPrice })

export const SET_NETWORK_ID = "SET_NETWORK_ID";
export const setNetworkId = id => ({ type: SET_NETWORK_ID, id })

export const SET_PLAYER_ADDRESS = "SET_PLAYER_ADDRESS";
export const setPlayerAddress = address => ({ type: SET_PLAYER_ADDRESS, address })

export const LOAD_GAME_DATA = "LOAD_GAME_DATA";
export const loadGamedata = () => ({ type: LOAD_GAME_DATA, levels: undefined })

export const LOAD_ETHERNAUT_CONTRACT = "LOAD_ETHERNAUT_CONTRACT";
export const loadEthernautContract = () => ({ type: LOAD_ETHERNAUT_CONTRACT, contract: undefined })

export const ACTIVATE_LEVEL = "ACTIVATE_LEVEL";
export const activateLevel = address => ({ type: ACTIVATE_LEVEL, address })

export const DEACTIVATE_LEVEL = "DEACTIVATE_LEVEL";
export const deactivateLevel = level => ({ type: DEACTIVATE_LEVEL, level })

export const LOAD_LEVEL_INSTANCE = "LOAD_LEVEL_INSTANCE";
export const loadLevelInstance = (level, reuse) => ({ type: LOAD_LEVEL_INSTANCE, level, reuse, instance: undefined })

export const SUBMIT_LEVEL_INSTANCE = "SUBMIT_LEVEL_INSTANCE";
export const submitLevelInstance = (level, completed) => ({ type: SUBMIT_LEVEL_INSTANCE, level, completed })

export const SYNC_PLAYER_PROGRESS = "SYNC_PLAYER_PROGRESS";
export const syncLevelProgress = () => ({ type: SYNC_PLAYER_PROGRESS })

export const COLLECT_STATS = "COLLECT_STATS";
export const collectStats = () => ({ type: COLLECT_STATS })

export const SET_BLOCK_NUM = "SET_BLOCK_NUM";
export const setBlockNum = num => ({ type: SET_BLOCK_NUM, blockNum: num })