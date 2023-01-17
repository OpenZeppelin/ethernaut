const fs = require("fs");
const { evaluateHistoricalProfile } = require("../../tools/evaluateHelper.cjs")

const compileNetworkPlayersBoard = async (networks) => {
  for (network of networks) {
    let allPlayers = [];
    const networkBoard = require(`../../../networks/${String(network.name).toLowerCase()}/${network.name}NetworkBoard.json`);
    const networkBoardWithTotals = evaluateHistoricalProfile(networkBoard, network);
    networkBoardWithTotals.forEach((profile) => {
      allPlayers.push(profile);
    });
    console.log(networkBoardWithTotals);

    console.log(
      `get out your lightsabre - we have morphed the ${network.name}NetworkBoard to create the ${network.name}PlayersBoard!`
    );

    //let networkAllPlayersPath = `../../../networks/${String(network.name).toLowerCase()}/${network.name}PlayersBoard.json`;
    let networkAllPlayersPath = `../../../networks/${String(network.name).toLowerCase()}/${network.name}PlayersBoard.json`;
    let testExample = require(networkAllPlayersPath);
    console.log(JSON.parse(testExample));

    fs.writeFileSync(networkAllPlayersPath, JSON.stringify(allPlayers), (err) => { console.log(error) });
  }
};

module.exports = compileNetworkPlayersBoard;
