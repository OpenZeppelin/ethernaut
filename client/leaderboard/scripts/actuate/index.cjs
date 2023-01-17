const refreshEthernautBasedData = require("./refreshEthernautBasedData.cjs");
const crawlForFreshEntriesAndUpdateNetworkBoard = require("../crawlers/crawlNewData/index.cjs");
const writeLeaderBoards = require("./writeLeaderBoards.cjs");
const consoleCustomiser = require("../../utils/consoleCustomiser.cjs");
const { logger } = consoleCustomiser({ delay: 50, randomized: true });

const trigger = async () => {
  /**
   * trigger this script to run the entire leaderboard update process.
   * NB fetchAndAddAliases is not yet functional, contained within crawlForFreshEntriesAndUpdateNetworkBoard()
   */

  refreshEthernautBasedData();
  await crawlForFreshEntriesAndUpdateNetworkBoard();
  writeLeaderBoards(logger);

};

trigger();
