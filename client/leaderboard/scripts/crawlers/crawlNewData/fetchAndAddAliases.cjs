const fs = require("fs");
const leaderBoardPath = "client/leaderboard/boards/leaderboard.json";

const fetchAndAddAliases = async () => {
  const aliasArray = await fetchAliases();
  await addAliases(aliasArray)
};

const fetchAliases = () => {
  return []
};

const addAliases = async (aliasArray) => {
  const leaderBoard = JSON.parse(fs.readFileSync(leaderBoardPath));

  const newLeaderBoard = leaderBoard.map((entry) => {
    for(let i = 0; i < aliasArray.length; i++) {
      if(entry.player === aliasArray[i].player) {
        return {
          ...entry,
          alias: aliasArray[i].alias
        }
      }
    }
    return entry;
  });

  fs.writeFileSync(leaderBoardPath, JSON.stringify(newLeaderBoard));
};

module.exports = fetchAndAddAliases;
