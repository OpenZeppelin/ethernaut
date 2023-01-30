const leaderBoardPath = "client/leaderboard/boards/leaderBoard.json";
const allPlayersBoardPath = "client/leaderboard/boards/allPlayersBoard.json";
const fs = require("fs");
const networks = require("../../utils/networkDetails.json");
const { reCalculateScores } = require("../tools/evaluateHelper.cjs");

const writeLeaderBoards = async (logger) => {

  // 1. compile network leaderboards
  for (let network of networks) {
    const networkLeaderBoardPath = `client/leaderboard/boards/networkleaderboards/${network.name}LeaderBoard.json`;
    const networkPlayersBoard = require(`../../networks/${String(network.name)}/${network.name}PlayersBoard.json`);
    let playersBoardWithScores = reCalculateScores(networkPlayersBoard);
    let networkLeaderBoard = playersBoardWithScores.sort((a, b) => {
      return b.score - a.score;
    });
    fs.writeFileSync(networkLeaderBoardPath, JSON.stringify(networkLeaderBoard));
    console.log("networkLeaderBoard scribed for " + network.name)
  }

  // 2. compile global players board
  let allPlayersBoard = [];
  for (let network of networks) {
    const networkLeaderBoard = require(`../../boards/networkleaderboards/${network.name}LeaderBoard.json`);
    allPlayersBoard = [...allPlayersBoard, ...networkLeaderBoard];
  }
  fs.writeFileSync(allPlayersBoardPath, JSON.stringify(allPlayersBoard));


  // 3. write global leaderboard
  let allPlayersUnsorted = require(allPlayersBoardPath);
  let trimmedAllPlayersUnsorted = allPlayersUnsorted.map((player) => {
    if (player.totalNumberOfLevelsCompleted >= 4 && player.score < 100) {
      return player;
    }
  })
  let leaderBoard = trimmedAllPlayersUnsorted.sort((a, b) => {
      return b.playerScore - a.playerScore;
    });
  fs.writeFileSync(leaderBoardPath, JSON.stringify(leaderBoard));
  console.log(
    "button up your mittens, because the leaders have come forth! Leader board written from historical data."
  );
};

module.exports = writeLeaderBoards;