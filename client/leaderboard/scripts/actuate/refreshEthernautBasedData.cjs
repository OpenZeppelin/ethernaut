const { createDifficultyMaps } = require("../../utils/mapLevels.cjs")

const refreshEthernautBasedData = async (logger) => {
    await logger("it has begun...refreshing levelsObjects across all networks");
    createDifficultyMaps();
    await logger("feeling fresh? get ready to crawl, baby");
};

module.exports = refreshEthernautBasedData;
