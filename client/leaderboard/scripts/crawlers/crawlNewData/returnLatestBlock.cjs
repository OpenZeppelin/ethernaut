const networks = require("../../../utils/networkDetails.json");
const initialiseNodeProvider = require("../crawlHistoricalData/initialiseNodeProvider.cjs");

let answer = "";

const returnLatestBlock = async (network) => {
  const nodeProvider = initialiseNodeProvider(network);
  const latestBlock = await nodeProvider.getBlockNumber();
  answer = latestBlock;
  return answer;
};

module.exports = returnLatestBlock;
