const fs = require("fs");
const gameData = require("../../src/gamedata/gamedata.json");
const networks = require("./networkDetails.json");

const createDifficultyMaps = () => {
  for (network of networks) {
    const difficultyMapPath = `../networks/${String(network.name).toLowerCase()}/difficultyMap${network.name}.json`;
    const difficultyMap = mapLevels(network);
    fs.writeFileSync(difficultyMapPath, JSON.stringify(difficultyMap));
  }
};

const mapLevels = (network) => {

  const networkLevelsObject = require(`../../src/gamedata/deploy.${String(network.deployName).toLowerCase()}`);
  let gameLevelsArray = gameData["levels"];
  let nameData = [];
  const figureOutGameAddressFromIndex = (index) => {
    let address = networkLevelsObject[index]
    return address;
  }
  gameLevelsArray.forEach((level, index) => {
    try {
      let entry = {
        name: level.name,
        difficulty: level.difficulty,
        address: figureOutGameAddressFromIndex(index),
      };
      nameData.push(entry);
    } catch (error) {}
  });

  return nameData;
};

createDifficultyMaps();

module.exports = createDifficultyMaps
