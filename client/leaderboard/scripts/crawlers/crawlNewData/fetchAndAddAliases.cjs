const fs = require("fs");
const leaderBoardPath = "client/leaderboard/boards/leaderboard.json";

const fetchAndAddAliases = () => {
  const aliasArray = [];
  const fetchAliases = () => {
    //////////////////////////////////////////////////////////////////////////
    /**write code above here to populate an array with a
     * player : alias
     * key value pairing*/
    //////////////////////////////////////////////////////////////////////////
  };

  fetchAliases();

  const addAliases = (aliasArray) => {
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

  addAliases(aliasArray);
};

module.exports = fetchAndAddAliases;
