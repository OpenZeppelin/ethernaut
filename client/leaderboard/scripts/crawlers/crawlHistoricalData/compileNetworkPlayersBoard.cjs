const fs = require("fs");
const { evaluateHistoricalPlayersProfile } = require("../../tools/evaluateHelper.cjs")

const compileNetworkPlayersBoard = async (networks) => {
  for (let network of networks) {
    let allPlayers = [];
    const networkBoard = require(`../../../networks/${String(network.name).toLowerCase()}/${network.name}NetworkBoard.json`);
    const networkBoardWithTotals = evaluateHistoricalPlayersProfile(networkBoard, network);
    networkBoardWithTotals.forEach((profile) => {
      allPlayers.push(profile);
    });

    console.log(
      `get out your lightsabre - we have morphed the ${network.name}NetworkBoard to create the ${network.name}PlayersBoard!`
    );

    let networkAllPlayersPath = `client/leaderboard/networks/${String(network.name).toLowerCase()}/${network.name}PlayersBoard.json`;
    fs.writeFileSync(networkAllPlayersPath, JSON.stringify(allPlayers), (err) => { console.log(error) });
  }
};

module.exports = compileNetworkPlayersBoard;