const fs = require("fs");
// const allPlayersBoard = require("../../../boards/allPlayersBoard.json");
// const freshEntriesCrawl = require("../../../boards/freshEntriesCrawl.json");
// const testBoardPath = "../../../boards/testBoard.json";

//////////////////////////////////////////////////////////////////////////////////////////////

const updateNetworkPlayersBoard = async (network, logger) => {

  const playersBoard = require(`../../../networks/${String(network.name).toLowerCase}/${network.name}PlayersBoard.json`);
  const networkFreshCrawl = require(`../../../networks/${String(network.name).toLowerCase}/lastCrawl${network.name}.json`);
  const playersBoardPath = `../../../networks/${String(network.name).toLowerCase}/${network.name}PlayersBoard.json`;

  networkFreshCrawl.forEach((entry) => {
    const index = playersBoard.findIndex((p) => p.player === entry.player);
    if (index !== -1) {
      playersBoard[index].totalDifficultyFaced += entry.totalDifficultyFaced;
      if (entry.totalNumberOfLevelsCompleted > playersBoard[index].totalNumberOfLevelsCompleted) {
        playersBoard[index].totalNumberOfLevelsCompleted = entry.totalNumberOfLevelsCompleted;
        playersBoard[index].averageTimeTakenToCompleteALevel = entry.averageTimeTakenToCompleteALevel;
      }
    } else {
      playersBoard.push(entry);
    }
    fs.writeFileSync(playersBoardPath, JSON.stringify(playersBoard));
  })

  await logger(
    "Did you bring your towel, punk?! Fresh entries were crawled and the playersBoard is ready to be updated!!"
  );


};

module.exports = updateNetworkPlayersBoard;

//////////////////////////////////////////////////////////////////////////////////////////////

// const updatePlayersBoard = () => {

//   console.log(allPlayersBoard)

  
//   freshEntriesCrawl.forEach((entry) => {
//     const index = allPlayersBoard.findIndex((p) => p.player === entry.player);
//     if (index !== -1) {
//       allPlayersBoard[index].totalDifficultyFaced += entry.totalDifficultyFaced;
//       if (entry.totalNumberOfLevelsCompleted > allPlayersBoard[index].totalNumberOfLevelsCompleted) {
//         allPlayersBoard[index].totalNumberOfLevelsCompleted = entry.totalNumberOfLevelsCompleted;
//         allPlayersBoard[index].averageTimeTakenToCompleteALevel = entry.averageTimeTakenToCompleteALevel;
//       }
//     } else {
//       allPlayersBoard.push(entry);
//     }
//     fs.writeFileSync(testBoardPath, JSON.stringify(allPlayersBoard));
//   })


// };

// module.exports = updatePlayersBoard;
