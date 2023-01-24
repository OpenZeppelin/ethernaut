const {
  evaluateCurrentSolveInstanceHex,
  returnCurrentLevel,
} = require("../../tools/evaluateHelper.cjs");
let i = 0;
const filterLogs = async (
  logs,
  nodeProvider,
  fromBlock,
  switchoverBlock,
  web3,
  mappingDataPath
) => {
  const filteredData = [];
  for (let log of logs) {
    i++;
    console.log(i)
    try {
      let txn = await nodeProvider.getTransaction(log.transactionHash);
      let block = await nodeProvider.getBlock(log.blockNumber);
      const filteredLog = {
        player: String(txn.from),
        eventType:
          String(log.topics[0]) ===
          evaluateCurrentSolveInstanceHex(
            log.blockNumber,
            switchoverBlock
          )
            ? "LevelCompleted"
            : "InstanceCreated",
        blockNumber: log.blockNumber,
        timeStamp: block.timestamp,
        level: returnCurrentLevel(
          switchoverBlock,
          txn,
          log,
          web3,
          mappingDataPath
        ),
      };
      filteredData.push(filteredLog);
    } catch (error) {
      console.log(error);
    }
  }
  return filteredData;
};

const chunkArray = (array, size) => { 
  const chunkedArray = []; 
  for (let i = 0; i < array.length; i += size) { 
    chunkedArray.push(array.slice(i, i + size)); 
  } 
  return chunkedArray;
}

const filterLogsInParallel = async (
  logs,
  nodeProvider,
  fromBlock,
  switchoverBlock,
  web3,
  mappingDataPath
) => { 
  const noOfParallelCalls = 10;
  const sizeOfChunk = Math.ceil(logs.length / noOfParallelCalls);
  const chunkedLogs = chunkArray(logs, sizeOfChunk); 
  const filteredData = []; 
  const promises = chunkedLogs.map(async (chunk) => { 
    const filteredChunk = await filterLogs(chunk, nodeProvider, fromBlock, switchoverBlock, web3, mappingDataPath); 
    filteredData.push(...filteredChunk); 
  }); 
  await Promise.all(promises); 
  return filteredData; 
}

module.exports = filterLogsInParallel;
