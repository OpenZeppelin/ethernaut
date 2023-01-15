# Blockchain Crawler

A simple trawler, crawler, and general miscrient for finding, decoding and writing datas from logs on Ethereum chains running official versions of Open Zeppelin's Ethernaut.

Completed using Alchemy.

To use, run

`npm init`

and then

`npm install alchemy-sdk`

&

`npm install alch/alchemy-web3`

&

`npm install web3`

# Ethernaut

This code has been uploaded **filled with majestic data points**, but can be ran from scratch if need be.

Here's how that process would go:

1.  Change the API keys in the file `./utils/networkDetails.json` to include _your API keys_ for **Alchemy** and in `01_crawlHistoricalData.js` for **Infura** respectively.

2.  Run `index.js` script under `blockScraper/Scripts/crawlHistoricalData` to collate all old data from historial **Ethernaut** deployments/networks and write them to the global leader board.

3.  From an automater or action, periodically run scripts `index.js` under `blockScraper/Scripts/crawlNewData` to enter new games from the relevant networks, add aliases to the global leader board and generate the complete leader board JSON.

**NB.** _Be sure to initialise `allPlayersBoard.json` and `newPlayersBoard.js` with an empty array `[]` if modifying the scripts._

**NB.** _Any automator/action triggers a crawl from the block defined as `lastFrom` under `utils/networkDetails` per network. At the end of each run, this `fromBlock` value is updated. As such, if testing, be sure to omit the `updateNetworkDetails` function until you are happy to leave the action running on whatever period. The `.yaml` file included in this repo runs twice a day_

# BUGS

Here's some things that needs to be changed from development in local to production deployment:

- access to ethernautLevels / gamedata <mapLevels, >
- access to each network's levels mapping <>
- return of current number of ethernaut levels <crawlNewData, crawlHistoricalData>
- incorporate 'recalculateScores' functionality
