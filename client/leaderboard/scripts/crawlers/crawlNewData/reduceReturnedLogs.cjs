const { evaluateIfThisPlayerHasAlreadyCompletedThisLevel } = require('../../tools/evaluateHelper.cjs');

const reduceReturnedLogs = (logs, network) => {
    reducedLogs = [];
    logs.forEach((entry) => {
        const existingEntry = reducedLogs.find((log) => log.player === entry.player);
        const networkBoard = require(`../../../networks/${String(network.name).toLowerCase()}/${network.name}NetworkBoard.json`);
        const hasThisPlayerAlreadyCompletedThisLevel = evaluateIfThisPlayerHasAlreadyCompletedThisLevel(entry.player, entry.levelFacedOnThisAttempt, networkBoard)
        console.log("it's " + hasThisPlayerAlreadyCompletedThisLevel + " on previous level completion this time")
        //first, we check if this is a bug output by seeing if this player already completed this level in the historicalCrawl
        if (hasThisPlayerAlreadyCompletedThisLevel) {
            console.log('bug output')
            return;
            //if they have, we do nothing
        } else
        //if they haven't, we check to see if this is a duplicate entry from this batch of Statistics.sol emits levelFacedOnThisAttempt
        if (existingEntry && existingEntry.levelFacedOnThisAttempt === entry.levelFacedOnThisAttempt && existingEntry.player === entry.player) {
                console.log('duplicate entry')
                return;
                //if it is a duplicate entry, we do nothing
            } 
            else {
                console.log("writing entry " + reducedLogs.length)
                /**there isn't an existing entry for this player for this level */
                reducedLogs.push(entry);

            }
    });
    return reducedLogs;
};

module.exports = reduceReturnedLogs;