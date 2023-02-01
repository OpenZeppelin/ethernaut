const initialiseNodeProvider = require("../crawlHistoricalData/initialiseNodeProvider.cjs");
const reduceReturnedLogs = require("./reduceReturnedLogs.cjs");
const {
  evaluateDifficultyInThisStatisticsEmit,
  evaluateDecodedLevelAddress,
} = require("../../tools/evaluateHelper.cjs");
const callFunctionWithRetry = require("../../tools/callFunctionWithRetry.cjs");

const NO_OF_PARALLEL_CALLS = 10;

const callBlockChain = async (network, web3, upperBlock) => {
  let logs = [];
  console.log(
    "Now, hold onto your horses! The " +
      network.name +
      " crawl has been initiated. Please wait some moments..."
  );
  const nodeProvider = initialiseNodeProvider(network);
  const incrementer = 2000;
  let lastFromBlock = network.lastFrom;
  let nextToBlock = network.lastFrom + incrementer;
  console.log(`Upper block - ${upperBlock}`);
  do {
    console.log(`nextToBlock - ${nextToBlock}`);
    // eslint-disable-next-line no-loop-func
    const promise = () => nodeProvider.getLogs({
      fromBlock: lastFromBlock,
      toBlock: nextToBlock,
      address: network.statisticsAddress,
      topics: [
        "0x18f89fb58208351d054bc0794e723a333ae0a74acd73825a9f31d89af0c67551",
      ],
    });
    const logDump = await callFunctionWithRetry(promise);
    if (logDump) {
      const chunkedLogs = chunk(logDump, NO_OF_PARALLEL_CALLS);
      for (let i = 0; i < chunkedLogs.length; i++) { 
        const results = await Promise.all(
          chunkedLogs[i].map(
            (log) => getPlayerEntry({ log, web3, network, nodeProvider }) 
          )
        )
        const filteredResults = results.filter(result => result !== undefined)
        logs.push(...filteredResults);
      }
      lastFromBlock = nextToBlock + 1;
      nextToBlock = lastFromBlock + incrementer;
    }
  } while (nextToBlock < upperBlock);
  const reducedLogs = reduceReturnedLogs(logs, network);
  return reducedLogs;
};

const chunk = (arr, size) => { 
  const chunked_arr = [];
  let index = 0;
  while (index < arr.length) {
    chunked_arr.push(arr.slice(index, size + index));
    index += size;
  }
  return chunked_arr;
}

const getPlayerEntry = async ({ log, web3, network, nodeProvider }) => { 
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
  const additionalDifficultyFaced =
    await evaluateDifficultyInThisStatisticsEmit(
      network,
      log,
      web3,
      nodeProvider
    );
  const decodedLevelAddress = await evaluateDecodedLevelAddress(
    network,
    log,
    web3,
    nodeProvider
  );
  try {
    let playerEntry = {
      player: topic1Array.player,
      averageTimeTakenToCompleteALevel: parseInt(topic2Array.time),
      totalNumberOfLevelsCompleted: parseInt(topic3Array.number),
      levelFacedOnThisAttempt: decodedLevelAddress,
      additionalDifficultyFaced: parseInt(additionalDifficultyFaced),
      alias: "",
    };
    return playerEntry;
  } catch (error) {
    console.log(error);
  }
}

module.exports = callBlockChain;
