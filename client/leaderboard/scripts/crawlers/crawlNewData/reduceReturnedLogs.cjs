const { evaluateIfThisPlayerHasAlreadyCompletedThisLevel } = require('../../tools/evaluateHelper.cjs');

const reduceReturnedLogs = (logs, network) => {

    //this function essentially removes all duplicate entries from the logs array. These duplicates can only have been caused by the Statistics.sol emit bug that overwrote first time entries (it has now been fixed)
    reducedLogs = [];

    logs.forEach((entry) => {
        

        const existingEntry = reducedLogs.find((log) => log.playerAddress === entry.playerAddress);

        const networkBoard = require(`../../NetworkBoards/${network.name}NetworkBoard.json`);
        const hasThisPlayerAlreadyCompletedThisLevel = evaluateIfThisPlayerHasAlreadyCompletedThisLevel(entry.player, entry.levelFacedOnThisAttempt, networkBoard)
        //first, we check if this is a bug output by seeing if this player already completed this level in the historicalCrawl
        if (hasThisPlayerAlreadyCompletedThisLevel) {
            //if they have, we do nothing
        }

        //if they haven't, we check to see if this is a duplicate entry from this batch of Statistics.sol emits
        if (existingEntry) {
            if (existingEntry.levelFacedOnThisAttempt === entry.levelFacedOnThisAttempt) {
                //if it is a duplicate entry, we do nothing
            }
        }
        else /**there isn't an existing entry for this player for this level */ {
            reducedLogs.push(entry);
        }
    });

    return reducedLogs;
};

module.exports = reduceReturnedLogs;