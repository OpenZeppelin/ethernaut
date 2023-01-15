const fs = require("fs");
const leaderBoardPath = ".../../../boards/leaderboard.json";
const testBoardPath = ".../../../boards/testBoard.json";

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
      if (lastAliasArray.player === entry.player) {
        lastAliasArray.alias = entry.alias;
      }
    });

    fs.writeFileSync(testBoardPath, JSON.stringify(newLeaderBoard));
  };

  addAliases(aliasArray);
};

module.exports = fetchAndAddAliases;
