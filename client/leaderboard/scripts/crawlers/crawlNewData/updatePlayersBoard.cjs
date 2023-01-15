const fs = require("fs");
const allPlayersBoard = require("../../../boards/allPlayersBoard.json");
const freshEntriesCrawl = require("../../../boards/freshEntriesCrawl.json");
const testBoardPath = "../../../boards/testBoard.json";

const updatePlayersBoard = () => {

  console.log(allPlayersBoard)

  
  freshEntriesCrawl.forEach((entry) => {
    const index = allPlayersBoard.findIndex((p) => p.player === entry.player);
    if (index !== -1) {
      allPlayersBoard[index].totalDifficultyFaced += entry.totalDifficultyFaced;
      if (entry.totalNumberOfLevelsCompleted > allPlayersBoard[index].totalNumberOfLevelsCompleted) {
        allPlayersBoard[index].totalNumberOfLevelsCompleted = entry.totalNumberOfLevelsCompleted;
        allPlayersBoard[index].averageTimeTakenToCompleteALevel = entry.averageTimeTakenToCompleteALevel;
      }
    } else {
      allPlayersBoard.push(entry);
    }
    fs.writeFileSync(testBoardPath, JSON.stringify(allPlayersBoard));
  })


};

module.exports = updatePlayersBoard;
