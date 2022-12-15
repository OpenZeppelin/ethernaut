
import { getTruffleContract, getNetworkNamefromId } from './ethutil';
import Web3 from 'web3';

export const getLevelsSolvedByPlayer = async (playerAddress, networkId) => {
    if (!(playerAddress || networkId)) {
        return;
    }
    const networkName = getNetworkNamefromId(networkId)
    if (!networkName) { 
        return
    }
    const levelAddresses = getLevelAddressesInNetwork(networkName)
    const proxyStatsAddress = getProxyStatsContractAddressInNetwork(networkName)
    const statsContract = await getStatsContract(proxyStatsAddress, playerAddress)
    const listOfLevelsSolved = await getListOfLevelsSolvedByPlayer(statsContract, levelAddresses, playerAddress, 5)
    return listOfLevelsSolved
}

export const getPercentageOfLevelsSolvedByPlayer = async (playerAddress, networkId) => { 
    if (!(playerAddress || networkId)) {
        return
    }
    const networkName = getNetworkNamefromId(networkId)
    if (!networkName) { 
        return
    }
    const proxyStatsAddress = getProxyStatsContractAddressInNetwork(networkName)
    const statsContract = await getStatsContract(proxyStatsAddress, playerAddress)
    return await getPercentageOfLevelsSolved(statsContract, playerAddress)
     
}

export const checkIfPlayerExist = async (playerAddress, networkId) => { 
    if (!(playerAddress || networkId)) {
        return
    }
    const networkName = getNetworkNamefromId(networkId)
    if (!networkName) { 
        return
    }
    const proxyStatsAddress = getProxyStatsContractAddressInNetwork(networkName)
    const statsContract = await getStatsContract(proxyStatsAddress, playerAddress)
    return await statsContract.doesPlayerExist(playerAddress)
}

const getPercentageOfLevelsSolved = async (statsContract, playerAddress) => { 
    const response = await statsContract.getPercentageOfLevelsCompleted(playerAddress)
    const roundedPercentage = (Web3.utils.fromWei(response.toString()) * 100).toFixed(2)
    return roundedPercentage
}


const getListOfLevelsSolvedByPlayer = async (statsContract, levelAddresses, playerAddress, noOfQueriesAtAtime) => { 
    const isLevelSolvedRequestsList = getIsLevelSolvedRequestsList(statsContract, levelAddresses, playerAddress)
    const isLevelSolvedRequestsListChunked = chunk(isLevelSolvedRequestsList, noOfQueriesAtAtime)
    let isLevelSolvedList = []
    for (let i = 0; i < isLevelSolvedRequestsListChunked.length; i++) {
        const result = await Promise.all(isLevelSolvedRequestsListChunked[i])
        isLevelSolvedList.push(...result)
    }
    return getListOfSolvedLevels(isLevelSolvedList)
}

const getListOfSolvedLevels = (isLevelSolvedList) => { 
    const listOfSolvedLevels = isLevelSolvedList
        .filter(item=>item.isSolved)
        .map(item=>item.levelAddress)
    return listOfSolvedLevels
}

const chunk = (list, chunkSize) => { 
    let chunkedList = [...Array(Math.ceil(list.length / chunkSize))].map(_ => list.splice(0, chunkSize))
    return chunkedList
}

const getIsLevelSolvedRequestsList = (statsContract, levelAddresses, playerAddress) => { 
    const levelNos = Object.keys(levelAddresses);
    const listOfIsLevelSolvedRequests = []
    for (let levelNo of levelNos) { 
        listOfIsLevelSolvedRequests.push(isLevelSolvedByPlayer(statsContract, levelAddresses[levelNo], playerAddress))
    }
    return listOfIsLevelSolvedRequests;
}

const isLevelSolvedByPlayer = async (statsContract, levelAddress, playerAddress) => { 
    const isSolved = await statsContract.isLevelCompleted(playerAddress, levelAddress)
    return {
        levelAddress,
        isSolved,
    };
}

const getLevelAddressesInNetwork = (networkName) => {
    const deployedNetworkData = require(`../gamedata/deploy.${networkName}.json`);
    const keys = Object.keys(deployedNetworkData);
    const levelAddresses = {}
    for (let key of keys) { 
        if (!isNaN(Number(key))) { 
            levelAddresses[key] = deployedNetworkData[key];
        }
    }
    return levelAddresses;
}

const getProxyStatsContractAddressInNetwork = (networkName) => {
    const deployedNetworkData = require(`../gamedata/deploy.${networkName}.json`);
    return deployedNetworkData['proxyStats'];
}

const getStatsContract = async (proxyStatsAddress, playerAddress) => { 
    const statsABI = require("contracts/build/contracts/metrics/Statistics.sol/Statistics.json");
    const statsContract = getTruffleContract(statsABI, { from: playerAddress });
    const statsContractInstance = await statsContract.at(proxyStatsAddress)
    return statsContractInstance;
}