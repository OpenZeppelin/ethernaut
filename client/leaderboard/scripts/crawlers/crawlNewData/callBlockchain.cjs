const initialiseNodeProvider = require("../crawlHistoricalData/initialiseNodeProvider.cjs");
const reduceReturnedLogs = require("./reduceReturnedLogs.cjs");
const {
  evaluateDifficultyInThisStatisticsEmit,
  evaluateDecodedLevelAddress
} = require("../../tools/evaluateHelper.cjs");

const callBlockChain = async (network, web3, logger, upperBlock) => {
  let logs = [];
  await logger(
    "Now, hold onto your horses! The " +
      network.name +
      " crawl has been initiated. Please wait some moments..."
  );

  const nodeProvider = initialiseNodeProvider(network);
  const incrementer = 2000;
  
  let lastFromBlock = network.lastFrom;
  let nextToBlock = network.lastFrom + incrementer;

  do {
    const logDump = await nodeProvider.getLogs({
      fromBlock: lastFromBlock,
      toBlock: nextToBlock,
      address: network.statisticsAddress,
      topics: [
        "0x18f89fb58208351d054bc0794e723a333ae0a74acd73825a9f31d89af0c67551",
      ],
    });

    if (logDump) {
      for (log of logDump) {

        let dataArray1 = [{ type: "address", name: "player" }];
        let dataArray2 = [{ type: "uint256", name: "time" }];
        let dataArray3 = [{ type: "uint256", name: "number" }];

        const topic1Array = web3.eth.abi.decodeParameters(
          dataArray1,
          String(log.topics[1])
        );

        const topic2Array = web3.eth.abi.decodeParameters(
          dataArray2,
          String(log.topics[2])
        );

        const topic3Array = web3.eth.abi.decodeParameters(
          dataArray3,
          String(log.topics[3])
        );

        // const txn = await nodeProvider.getTransaction(String(log.transactionHash));
        // console.log(txn)

        //const difficultyAndLevelFacedObject = await evaluateDifficultyAndLevelInThisStatisticsEmit(network, log, web3, nodeProvider);

        

        const additionalDifficultyFaced = await evaluateDifficultyInThisStatisticsEmit(network, log, web3, nodeProvider);

        const decodedLevelAddress = await evaluateDecodedLevelAddress(network, log, web3, nodeProvider);

        try {
          let playerEntry = {
            player: topic1Array.player,
            averageTimeTakenToCompleteALevel: topic2Array.time,
            totalNumberOfLevelsCompleted: topic3Array.number,
            levelFacedOnThisAttempt: decodedLevelAddress,
            additionalDifficultyFaced,
            alias: "",
          };
          logs.push(playerEntry);
        } catch (error) {
          console.log(error);
        }
      }
      lastFromBlock = nextToBlock + 1;
      nextToBlock = lastFromBlock + incrementer;
    }
  } while (nextToBlock < upperBlock);

  console.log(`BOOM! The action added new entries from ${network.name}...`);

  const reducedLogs = reduceReturnedLogs(logs, network)

  return reducedLogs;
};

module.exports = callBlockChain;
