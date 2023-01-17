const fs = require("fs");
const callBlockChain = require("./callBlockchain.cjs");
const updateNetworkDetails = require("./updateNetworkDetails.cjs");
const returnLatestBlock = require("./returnLatestBlock.cjs");
const updateNetworkPlayersBoard = require("./updateNetworkPlayersBoard.cjs");

const crawlForFreshEntries = async (network, web3, logger) => {

  
  const upperBlock = await returnLatestBlock(network);
  let logs = await callBlockChain(network, web3, upperBlock);
  const freshEntriesCrawlPath = `client/leaderboard/networks/${String(network.name).toLowerCase()}/lastCrawl${network.name}.json`
  
  await logger(
    `Buckle up, chuck, we're adding ${logs.length} emit profiles to lastCrawl${network.name}!`
  );
  fs.writeFileSync(freshEntriesCrawlPath, JSON.stringify(logs));
  await updateNetworkPlayersBoard(network, logger);
  await updateNetworkDetails(network, upperBlock);
  
};

module.exports = crawlForFreshEntries;
