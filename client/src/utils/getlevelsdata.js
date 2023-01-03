import { onPredeployedNetwork } from "../middlewares/setNetwork";
import { getLevelKey, restoreContract } from "./contractutil";

var levels = require(`../gamedata/gamedata.json`).levels;


export const getLevelDetailsByAddress = (levelAddress, chainId) => {
    const constants = require("../constants");
    const allLevels = require("client/src/gamedata/gamedata.json").levels;
    // If we are on a predeployed chain, fetch address from constants
    const gamedata = onPredeployedNetwork(chainId)
    ? require(`client/src/gamedata/deploy.${constants.ID_TO_NETWORK[chainId]}.json`)
    : restoreContract("77");
    // If we are not fetch from localstorage
    // based on the index fetch the level name and difficulty
    const addressToId = Object.fromEntries(
      Object.entries(gamedata).map((a) => a.reverse())
    );
    const levelId = addressToId[levelAddress];
    const currentLevel = allLevels[levelId];
    // include the difficulty circles to give more context
    const difficultyCircles = drawDifficultyCircle(currentLevel.difficulty)
    return {...currentLevel, difficultyCircles};
};

export const drawDifficultyCircle = (levelDifficulty) => {
    //Put as many ● as difficulty/2 (scaled from 10 to 5) and ○ as the rest up to 5
    var numberOfFullCircles = Math.ceil(levelDifficulty / 2);
    var numberOfEmptyCircles = 5 - numberOfFullCircles;
    var emptyCircle = "○";
    var fullCircle = "●";
    var difficulty = "";
    for (var j = 0; j < numberOfFullCircles; j++) {
      difficulty += fullCircle;
    }
  
    for (var k = 0; k < numberOfEmptyCircles; k++) {
      difficulty += emptyCircle;
    }

    return difficulty;
};

const getlevelsdata = (props, source) => {
    var levelData = [];
    let linkStyle = {};
    let levelComplete;
    let selectedIndex;

    for (var i = 0; i < levels.length; i++) {
        var difficulty = drawDifficultyCircle(levels[i].difficulty);

        if (props?.activeLevel) {
            const key = getLevelKey(props.params?.address);
            if (props.activeLevel[key] === levels[i][key]) {
                linkStyle.textDecoration = 'underline'
                selectedIndex = i;
            }
        }

        // Level completed
        levelComplete = props.player?.completedLevels[levels[i].deployedAddress] > 0

        var isMissingSVGImage;
        var isMissingPNGImage;

        try {
            isMissingSVGImage = require(`../../public/imgs/Level${levels[i].deployId}.svg`) ? false : true;
        } catch (error) {
            isMissingSVGImage = true;
        }
        try {
            isMissingPNGImage = require(`../../public/imgs/Level${levels[i].deployId}.png`) ? false : true;
        } catch (error) {
            isMissingPNGImage = true;
        }
        var object = {
            name: levels[i].name,
            src: isMissingSVGImage && isMissingPNGImage ? (
                source !== 'mosaic' ?
                    `../../imgs/BigDefault.svg` :
                    `../../imgs/Default.svg`
            ) : (
                isMissingPNGImage ? (
                    source !== 'mosaic' ?
                    `../../imgs/BigLevel${levels[i].deployId}.svg` :
                    `../../imgs/Level${levels[i].deployId}.svg`
                ) : (
                    source !== 'mosaic' ?
                    `../../imgs/BigLevel${levels[i].deployId}.png` :
                    `../../imgs/Level${levels[i].deployId}.png`
                )
                
            ),
            difficulty: difficulty,
            deployedAddress: levels[i].deployedAddress,
            completed: levelComplete,
            id: levels[i].deployId,
            creationDate: levels[i].created
        }

        levelData.push(object);
    }

    return [levelData, levelData[selectedIndex]];
}

export default getlevelsdata
