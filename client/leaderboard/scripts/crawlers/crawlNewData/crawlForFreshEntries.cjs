const fs = require("fs");
const callBlockChain = require("./callBlockchain.cjs");
const updateNetworkDetails = require("./updateNetworkDetails.cjs");
const returnLatestBlock = require("./returnLatestBlock.cjs");
const updateNetworkPlayersBoard = require("./updateNetworkPlayersBoard.cjs");

const crawlForFreshEntries = async (network, web3, logger) => {

  
  const upperBlock = await returnLatestBlock(network);
  let logs = await callBlockChain(network, web3, logger, upperBlock);
  //const lastFreshEntriesBoard = JSON.parse(fs.readFileSync(freshEntriesCrawlPath)) ? JSON.parse(fs.readFileSync(freshEntriesCrawlPath)) : [];
  // const freshEntriesCrawl = lastFreshEntriesBoard.concat(logs);
  const freshEntriesCrawlPath = `../../../networks/${String(network.name).toLowerCase}/${network.name}NetworkBoard.json`
  
  await logger(
    `Buckle up, chuck, we're adding ${logs.length} emit profiles to lastCrawl${network.name}!`
  );
  fs.writeFileSync(freshEntriesCrawlPath, JSON.stringify(logs));
  await updateNetworkPlayersBoard(network, logger);
  if (process.env.ENVIRONMENT == "PROD") {
    await updateNetworkDetails(network, upperBlock);
  }

  
};

module.exports = crawlForFreshEntries;
