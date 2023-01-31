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
    const logDump = await nodeProvider.getLogs({
      fromBlock: lastFromBlock,
      toBlock: nextToBlock,
      address,
      topics: [],
    });
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


module.exports = callBlockChain;
