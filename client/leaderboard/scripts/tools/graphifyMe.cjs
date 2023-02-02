const fs = require("fs");

const dataToGraphifyPath = "../../boards/leaderBoard.json";
const graphifiedDataPath = "./graphifiedDataSample.json";
const dataToGraphifyJson = fs.readFileSync(dataToGraphifyPath);
const dataToGraphify = JSON.parse(dataToGraphifyJson);

const graphify = (jsonInput) => {

    const allPlayers = [];
    let i = 1;
    jsonInput.forEach(profile => {
        try {
            let player = {
                rank: i,
                //numberCompleted: profile.totalNumberOfLevelsCompleted,
                score: profile.playerScore
            }
            allPlayers.push(player);
            console.log(player);
        } catch (error) {console.log(error)}
        i++;
    });
    fs.writeFileSync(graphifiedDataPath, JSON.stringify(allPlayers))

}

graphify(dataToGraphify);
