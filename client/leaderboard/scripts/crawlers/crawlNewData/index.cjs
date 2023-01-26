const crawlForFreshEntries = require("./crawlForFreshEntries.cjs");
const consoleCustomiser = require("../../../utils/consoleCustomiser.cjs");
const { logger } = consoleCustomiser({ delay: 50, randomized: true });
const Web3 = require("web3");
const web3 = new Web3();
const networks = require("../../../utils/networkDetails.json");
const fetchAndAddAliases = require("../fetchAndAddAliases.cjs");

const crawlForFreshEntriesAndUpdateNetworkBoard = async () => {
  
  for (let network of networks) {
    await crawlForFreshEntries(network, web3, logger);
    await logger(
      `Trumpets, glory and resounding success! ${network.name} was crawled like a 19th century garter!`
    );
  }
  await logger(
    ".........deck the halls, ya filthy animal! The allPlayersBoard is now updated! Let's #writeLeaderBoard !"
  );

  await fetchAndAddAliases();
  await logger(
    "get your magnifying glass out, Sherlock, because the leader board now belies.... the ALIASES!"
  );
};

crawlForFreshEntriesAndUpdateNetworkBoard()

module.exports = crawlForFreshEntriesAndUpdateNetworkBoard;
