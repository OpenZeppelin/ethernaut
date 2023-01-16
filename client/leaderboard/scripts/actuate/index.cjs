const refreshEthernautBasedData = require("./refreshEthernautBasedData.cjs");
const crawlForFreshEntriesAndUpdatePlayersBoard = require("../crawlers/crawlNewData/index.cjs");
const writeLeaderBoard = require("./writeLeaderBoard.cjs");
const { reCalculateScores } = require("../tools/evaluateHelper.cjs");
const consoleCustomiser = require("../../utils/consoleCustomiser.cjs");
const { logger } = consoleCustomiser({ delay: 50, randomized: true });

const trigger = () => {
  /**
   * trigger this script to run the entire leaderboard update process
   */
  refreshEthernautBasedData(logger);
  crawlForFreshEntriesAndUpdatePlayersBoard();
  writeLeaderBoard(logger, reCalculateScores);
  /*
   * the reCalculateScores implementation at this level is needless.
   * it has been placed here for clarity:
   * THIS IS WHERE SCORES ARE ASSESSED
  */

};

trigger();
