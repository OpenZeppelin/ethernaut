export const checkIfAliasIsPresent = (alias) => {
    try {
        const leaderBoardList = require("client/leaderboard/boards/leaderBoard.json");
        const foundAlias = leaderBoardList.find((entry) => {
            if (entry) {
                return entry.alias === alias
            } else {
                return false;
            }
        });
        if (foundAlias) {
            return true;
        } else {
            return false;
        }
    } catch (err) { 
        debugger;
        console.log(err)
    }
}