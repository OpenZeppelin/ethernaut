const { evaluateIfWeHavePassedReDeployment } = require("../../tools/evaluateHelper.cjs");

const callBlockChain = async (
  network,
  nodeProvider,
  fromBlock,
  toBlock,
  switchoverBlock,
  logger
) => {
  let logs = [];
  const incrementer = 2000;
  const upperBlock = toBlock;
  let lastFromBlock = fromBlock; //the first deployed Ethernaut block
  let nextToBlock = fromBlock + incrementer; //plus difference 3605, then 10,000 thereafter until 7968901
  console.log("Upper block", upperBlock);
  do {
    console.log("nextToBlock", nextToBlock);
    if (lastFromBlock < switchoverBlock && nextToBlock > switchoverBlock) {
      nextToBlock = switchoverBlock;
    }
    const address = !evaluateIfWeHavePassedReDeployment(
      lastFromBlock,
      switchoverBlock
    )
      ? network.oldAddress
      : network.newAddress;
    const logDump = await getLogsWithRetries(
      nodeProvider,
      lastFromBlock,
      nextToBlock,
      address,
      3
    )
    logs = logs.concat(logDump);
    lastFromBlock = nextToBlock + 1;
    nextToBlock =
      nextToBlock + incrementer + 1 > upperBlock
        ? upperBlock
        : nextToBlock + incrementer + 1;
  } while (lastFromBlock < upperBlock);
  await logger(`jee whizz! the total logs returned are ${logs.length}`);
  return logs;
};

const getLogsWithRetries = async (
  nodeProvider,
  lastFromBlock,
  nextToBlock,
  address,
  noOfRetries
) => { 
  let logDump;
  try {
    logDump = await nodeProvider.getLogs({
      fromBlock: lastFromBlock,
      toBlock: nextToBlock,
      address,
      topics: [],
    });
  } catch (err) { 
    if (noOfRetries > 0) {
      console.log("Retrying getLogs: ", noOfRetries, " remaining")
      logDump = await getLogsWithRetries(
        nodeProvider,
        lastFromBlock,
        nextToBlock,
        address,
        noOfRetries - 1
      );
      console.log("Retry successful")
      return logDump;
    } else {
      throw new Error("Failed to get logs");
    }
  }
 
}

module.exports = callBlockChain;
