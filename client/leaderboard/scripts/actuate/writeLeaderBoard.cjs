const leaderBoardPath = "../../boards/leaderBoard.json";
const testLeaderBoardPath = "../../boards/testLeaderBoard.json";
const fs = require("fs");

const writeLeaderBoard = async (logger, reCalculateScores) => {

  const allPlayersBoard = require("../../boards/allPlayersBoard.json");

  let playersBoardWithScores = reCalculateScores(allPlayersBoard);

  leaderBoard = playersBoardWithScores.sort((a, b) => {
    return b.playerScore - a.playerScore;
  });

  fs.writeFileSync(testLeaderBoardPath, JSON.stringify(leaderBoard));
  await logger(
    "button up your mittens, because the leaders have come forth! Leader board written from historical data."
  );
};

module.exports = writeLeaderBoard;
