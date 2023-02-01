const {
  evaluateIfWeHavePassedReDeployment,
} = require("../../tools/evaluateHelper.cjs");
const callFunctionWithRetry = require("../../tools/callFunctionWithRetry.cjs");

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

    // eslint-disable-next-line no-loop-func
    const promise = () => {
      return nodeProvider.getLogs({
        fromBlock: lastFromBlock,
        toBlock: nextToBlock,
        address,
        topics: [],
      });
    };

    const logDump = await callFunctionWithRetry(promise);

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
