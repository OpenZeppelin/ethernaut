const {
  evaluateCurrentSolveInstanceHex,
  returnCurrentLevel,
} = require("../../tools/evaluateHelper.cjs");

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
    try {
      let txn = await nodeProvider.getTransaction(log.transactionHash);
      let block = await nodeProvider.getBlock(log.blockNumber);
      const filteredLog = {
        player: String(txn.from),
        eventType:
          String(log.topics[0]) ===
          evaluateCurrentSolveInstanceHex(log.blockNumber, switchoverBlock)
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

module.exports = filterLogs;
