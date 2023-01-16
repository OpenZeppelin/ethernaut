const fs = require("fs");
const { Network, Alchemy, Utils } = require("alchemy-sdk");
const crawlForFreshEntries = require("./crawlForFreshEntries.cjs");
const updatePlayersBoard = require("./updatePlayersBoard.cjs");
const consoleCustomiser = require("../../../utils/consoleCustomiser.cjs");
const { logger } = consoleCustomiser({ delay: 50, randomized: true });
const fetchAndAddAliases = require("./fetchAndAddAliases.cjs");
const Web3 = require("web3");
const web3 = new Web3();
const networks = require("../../../utils/networkDetails.json");
const freshEntriesCrawlPath = "client/leaderboard/boards/freshEntriesCrawl.json";


const crawlForFreshEntriesAndUpdatePlayersBoard = async () => {
  fs.writeFileSync(freshEntriesCrawlPath, JSON.stringify([]));
  for (network of networks) {
    await crawlForFreshEntries(network, web3, logger, freshEntriesCrawlPath);
    await logger(
      `Trumpets, glory and resounding success! ${network.name} was crawled like a 19th century garter!`
    );
  }
  await logger(
    "Did you bring your towel, punk?! Fresh entries were crawled and the allPlayersBoard is ready to be updated!!"
  );
  updatePlayersBoard();
  await logger(
    ".........deck the halls, ya filthy animal! The allPlayersBoard is now updated! Let's #writeLeaderBoard !"
  );

  // fetchAndAddAliases();
  // await logger(
  //   "get your magnifying glass out, Sherlock, because the leader board now belies.... the ALIASES!"
  // );

};

crawlForFreshEntriesAndUpdatePlayersBoard();

module.exports = crawlForFreshEntriesAndUpdatePlayersBoard;
