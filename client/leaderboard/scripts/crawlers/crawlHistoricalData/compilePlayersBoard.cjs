const fs = require("fs");
const dataPath = "../../../boards/allPlayersBoard.json";
const { evaluateHistoricalProfile } = require("../../tools/evaluateHelper.cjs")

const compileAllPlayersBoard = async (networks, logger) => {
  let allPlayers = [];
  for (network of networks) {
    const networkBoardJson = fs.readFileSync(
      `../../../networks/${String(network.name).toLowerCase()}/${network.name}NetworkBoard.json`
    );
    const networkBoard = JSON.parse(networkBoardJson);
    const networkBoardWithTotals = evaluateHistoricalProfile(networkBoard, network);
    networkBoardWithTotals.forEach((profile) => {
      
        allPlayers.push(profile);
      
    });

    await logger(
      `ohhh this is exciting - we have moved the ${network.name} network board to the global all players board!`
    );
  }

  fs.writeFileSync(dataPath, JSON.stringify(allPlayers));
};

module.exports = compileAllPlayersBoard;
