const { evaluateIfWeHavePassedReDeployment } = require("../../tools/evaluateHelper.cjs");

const RETRY_ATTEMPTS = 10;

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
      RETRY_ATTEMPTS
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
    return logDump;
  } catch (err) { 
    console.log("Retrying getLogs")
    for (let i = 0; i < noOfRetries; i++) {
      console.log(`from block:${lastFromBlock}, to block:${nextToBlock}, attempt no: `,i + 1)
      try {
        logDump = await nodeProvider.getLogs({
          fromBlock: lastFromBlock,
          toBlock: nextToBlock,
          address,
          topics: [],
        });
        console.log(`Retry successful, from block:${lastFromBlock}, to block:${nextToBlock}`)
        return logDump;
      } catch (err) {
        console.log("error in getLogsWithRetries", err)
      }
    }
    throw new Error("getLogs failed")
  }
}

module.exports = callBlockChain;
