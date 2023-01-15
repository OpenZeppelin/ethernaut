const fs = require("fs");
const callBlockChain = require("./callBlockchain.cjs");
const updateNetworkDetails = require("./updateNetworkDetails.cjs");
const returnLatestBlock = require("./returnLatestBlock.cjs");

const crawlForFreshEntries = async (network, web3, logger, freshEntriesCrawlPath) => {
  const upperBlock = await returnLatestBlock(network);

  let logs = await callBlockChain(network, web3, logger, upperBlock);

  const lastFreshEntriesBoard = JSON.parse(fs.readFileSync(freshEntriesCrawlPath)) ? JSON.parse(fs.readFileSync(freshEntriesCrawlPath)) : [];

  const freshEntriesCrawl = lastFreshEntriesBoard.concat(logs);

  await logger(
    `Buckle up, chuck, we're adding ${logs.length} emit profiles to freshEntriesCrawl from ${network.name}`
  );

  fs.writeFileSync(freshEntriesCrawlPath, JSON.stringify(freshEntriesCrawl));
  if (process.env.ENVIRONMENT == "PROD") {
    await updateNetworkDetails(network, upperBlock);
  }
};

module.exports = crawlForFreshEntries;
