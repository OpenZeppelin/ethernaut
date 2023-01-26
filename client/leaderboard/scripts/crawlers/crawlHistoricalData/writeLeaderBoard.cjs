const leaderBoardPath = "../../../boards/leaderBoard.json";
const fs = require("fs");

const writeLeaderBoard = async (logger) => {
  const allPlayersBoard = require("../../../allPlayersBoard.json");
  let leaderBoard = [];
  leaderBoard = allPlayersBoard.sort((a, b) => {
    return b.playerScore - a.playerScore;
  });
  fs.writeFileSync(leaderBoardPath, JSON.stringify(leaderBoard));
  await logger(
    "button up your mittens, because the leaders have come forth! Leader board written from historical data."
  );
};

module.exports = writeLeaderBoard;
