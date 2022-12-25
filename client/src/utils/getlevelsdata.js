import { getLevelKey } from "./contractutil";

var levels = require(`../gamedata/gamedata.json`).levels;

const getlevelsdata = (props, source) => {
    var levelData = [];
    let linkStyle = {};
    let levelComplete;
    let selectedIndex;

    for (var i = 0; i < levels.length; i++) {

        //Put as many ● as difficulty/2 (scaled from 10 to 5) and ○ as the rest up to 5
        var numberOfFullCircles = Math.ceil(levels[i].difficulty / 2);
        var numberOfEmptyCircles = 5 - numberOfFullCircles;
        var emptyCircle = '○';
        var fullCircle = '●';
        var difficulty = '';
        for (var j = 0; j < numberOfFullCircles; j++) {
            difficulty += fullCircle;
        }

        for (var k = 0; k < numberOfEmptyCircles; k++) {
            difficulty += emptyCircle;
        }

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
                    `../../imgs/BigLevel${levels[i].deployId}.svg` :
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
