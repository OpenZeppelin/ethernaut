export const checkIfAliasIsPresent = (alias) => {
    const leaderBoardList = require("client/leaderboard/boards/leaderBoard.json");
    const foundAlias = leaderBoardList.find((entry) => { 
        return entry.alias === alias
    });
    if (foundAlias) {
        return true;
    } else { 
        return false;
    }
}