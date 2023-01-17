const createDifficultyMaps = require("../../utils/mapLevels.cjs");

const refreshEthernautBasedData = async () => {
    console.log("it has begun...refreshing difficultyMaps across all networks");
    createDifficultyMaps();
    console.log("feeling fresh? ...get ready to crawl, baby...");
};

module.exports = refreshEthernautBasedData;
