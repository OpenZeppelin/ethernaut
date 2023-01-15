const { createDifficultyMaps } = require("../../utils/mapLevels.cjs")

const refreshEthernautBasedData = async () => {
    console.log("refreshing levelsObjects across all networks")

    createDifficultyMaps();
};

module.exports = refreshEthernautBasedData;
