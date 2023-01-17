const refreshEthernautBasedData = require("./refreshEthernautBasedData.cjs");
const crawlForFreshEntriesAndUpdatePlayersBoard = require("../crawlers/crawlNewData/index.cjs");
const writeLeaderBoards = require("./writeLeaderBoards.cjs");
const { reCalculateScores } = require("../tools/evaluateHelper.cjs");
const consoleCustomiser = require("../../utils/consoleCustomiser.cjs");
const { logger } = consoleCustomiser({ delay: 50, randomized: true });

const trigger = () => {
  /**
   * trigger this script to run the entire leaderboard update process.
   * NB fetchAndAddAliases is not yet functional
   */
  refreshEthernautBasedData(logger);
  crawlForFreshEntriesAndUpdatePlayersBoard();
  writeLeaderBoards(logger, reCalculateScores); 

  //writeLeaderBoards(logger, reCalculateScores);

  /*
   * the reCalculateScores implementation .
   * has been placed here for clarity:
   * THIS IS WHERE SCORES ARE ASSESSED
  */
};

trigger();
