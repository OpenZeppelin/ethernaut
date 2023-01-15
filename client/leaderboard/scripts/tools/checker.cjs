const evaluateTotalDifficultyInEthernautGame = () => {
    const difficultyMap = require("../../../src/gamedata/gamedata.json"); //this represent gameData.json in the main repo
    let totalDifficulty = 0;
    difficultyMap.forEach((level) => {
      totalDifficulty += parseInt(level.difficulty);
    });
    console.log(totalDifficulty)
    return totalDifficulty
  }

  evaluateTotalDifficultyInEthernautGame();