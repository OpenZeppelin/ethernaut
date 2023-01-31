const {
  evaluateCurrentSolveInstanceHex,
  returnCurrentLevel,
} = require("../../tools/evaluateHelper.cjs");

const RETRY_ATTEMPTS = 10;
const NO_OF_PARALLEL_REQUESTS = 50

const filterLogs = async (
  logs,
  nodeProvider,
  fromBlock,
  switchoverBlock,
  web3,
  mappingDataPath
) => {
  const filteredData = [];
  const chunkedLogs = chunkArray(logs, NO_OF_PARALLEL_REQUESTS);
  console.log("total no of logs", logs.length);
  let processedLogsCount = 0;
  for (let i = 0; i < chunkedLogs.length; i++) {
    processedLogsCount += chunkedLogs[i].length;
    console.log("processed logs", processedLogsCount)
    const chunk = chunkedLogs[i];
    const promiseArray = chunk.map((log) => getFilteredLog(log, nodeProvider, switchoverBlock, web3, mappingDataPath));
    const results = await Promise.all(promiseArray);
    filteredData.push(...results);
  }
  return filteredData;
};

const chunkArray = (array, size) => { 
  const chunkedArray = [];
  let index = 0;
  while (index < array.length) {
    chunkedArray.push(array.slice(index, size + index));
    index += size;
  }
  return chunkedArray;
}

const getFilteredLog = async (
  log,
  nodeProvider,
  switchoverBlock,
  web3,
  mappingDataPath
) => { 
  
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
  return filteredLog;
}


module.exports = filterLogs;