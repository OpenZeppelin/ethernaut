var levels = require(`../gamedata/gamedata.json`).levels;

const getlevelsdata = (props, source) => {
    var levelData = [];
    let linkStyle = {};
    let levelComplete;
    let selectedIndex;

    for(var i = 0; i<levels.length; i++) {

        //Put as many ● as difficulty/2 (scaled from 10 to 5) and ○ as the rest up to 5
        var numberOfFullCircles = Math.ceil(levels[i].difficulty / 2);
        var numberOfEmptyCircles = 5 - numberOfFullCircles;
        var emptyCircle = '○';
        var fullCircle = '●';
        var difficulty = '';
        for(var j=0; j<numberOfFullCircles; j++) {
            difficulty+=fullCircle;
        }

        for(var k=0; k<numberOfEmptyCircles; k++) {
            difficulty+=emptyCircle;
        }

        if(props?.activeLevel) {
            if(props.activeLevel.deployedAddress === levels[i].deployedAddress) {
              linkStyle.textDecoration = 'underline'
              selectedIndex = i;
            }
        }
  
        // Level completed
        levelComplete = props.player?.completedLevels[levels[i].deployedAddress] > 0

        var isMissingImage;

        try {
            isMissingImage = require(`../../public/imgs/Level${levels[i].deployId}.svg`) ? false : true;
        } catch(error) {
            isMissingImage = true;
        }

        var object = {
            name: levels[i].name,
            src: isMissingImage ? `../../imgs/default.svg` : (
                source !== 'mosaic' ? `../../imgs/BigLevel${levels[i].deployId}.svg` : `../../imgs/Level${levels[i].deployId}.svg`
            ),
            difficulty: difficulty,
            deployedAddress: levels[i].deployedAddress,
            completed: levelComplete,
            id: levels[i].deployId,
            creationDate: levels[i].created
        }

        levelData.push(object);
    }

    return [levelData,levelData[selectedIndex]];
}

export default getlevelsdata
