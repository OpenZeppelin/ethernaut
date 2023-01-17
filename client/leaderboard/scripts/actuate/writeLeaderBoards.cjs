const leaderBoardPath = "../../boards/leaderBoard.json";
const allPlayersBoardPath = "../../boards/allPlayersBoard.json";
const testLeaderBoardPath = "../../boards/testLeaderBoard.json";
const fs = require("fs");
const networks = require("../../networks/networks.json");

const writeLeaderBoards = async (logger, reCalculateScores) => {

  // 1. compile network leaderboards
  for (network of networks) {
    const networkLeaderBoardPath = `../../boards/networkleaderboards/${network.name}LeaderBoard.json`;
    const networkPlayersBoard = require(`../../networks/${String(network.name)}/${network.name}PlayersBoard.json`);
    let playersBoardWithScores = reCalculateScores(networkPlayersBoard);
    let networkLeaderBoard = playersBoardWithScores.sort((a, b) => {
      return b.playerScore - a.playerScore;
    });
    fs.writeFileSync(networkLeaderBoardPath, JSON.stringify(networkLeaderBoard));
  }

  // 2. compile global players board
  let allPlayersBoard = [];
  for (network of networks) {
    const networkLeaderBoard = require(`../../boards/networkleaderboards/${network.name}LeaderBoard.json`);
    allPlayersBoard = [...allPlayersBoard, ...networkLeaderBoard];
  }
  fs.writeFileSync(allPlayersBoardPath, JSON.stringify(allPlayersBoard));


  // 3. write global leaderboard
  let allPlayersUnsorted = require(allPlayersBoardPath);
  let leaderBoard = allPlayersUnsorted.sort((a, b) => {
      return b.playerScore - a.playerScore;
    });
  fs.writeFileSync(testLeaderBoardPath, JSON.stringify(leaderBoard));

  await logger(
    "button up your mittens, because the leaders have come forth! Leader board written from historical data."
  );
};

module.exports = writeLeaderBoards;
