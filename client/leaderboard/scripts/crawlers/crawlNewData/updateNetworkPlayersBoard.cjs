const fs = require("fs");

const updateNetworkPlayersBoard = async (network, logger) => { 

  const playersBoard = require(`../../../networks/${String(network.name).toLowerCase()}/${network.name}PlayersBoard.json`);
  const networkFreshCrawl = require(`../../../networks/${String(network.name).toLowerCase()}/lastCrawl${network.name}.json`);
  const playersBoardPath = `client/leaderboard/networks/${String(network.name).toLowerCase()}/${network.name}PlayersBoard.json`;

  networkFreshCrawl.forEach((entry) => {
    const index = playersBoard.findIndex((p) => p.player === entry.player);
    if (index !== -1) {
      playersBoard[index].totalDifficultyFaced += entry.additionalDifficultyFaced;
      if (entry.totalNumberOfLevelsCompleted > playersBoard[index].totalNumberOfLevelsCompleted) {
        playersBoard[index].totalNumberOfLevelsCompleted = entry.totalNumberOfLevelsCompleted;
        playersBoard[index].averageTimeTakenToCompleteALevel = entry.averageTimeTakenToCompleteALevel;
      }
      if (playersBoard[index].totalNumberOfLevelsCompleted !== entry.totalNumberOfLevelsCompleted) { return }
    } else {
      let playerProfile = {
        player: entry.player,
        averageTimeTakenToCompleteALevel: entry.averageTimeTakenToCompleteALevel,
        totalNumberOfLevelsCompleted: entry.totalNumberOfLevelsCompleted,
        totalDifficultyFaced: entry.additionalDifficultyFaced,
        alias: ""
      }
      playersBoard.push(playerProfile);
    }
  })
  fs.writeFileSync(playersBoardPath, JSON.stringify(playersBoard));

  await logger(
    `Did you bring your towel, punk?! Fresh entries were crawled and the ${network.name}PlayersBoard has been updated!!`
  );


};

module.exports = updateNetworkPlayersBoard;

