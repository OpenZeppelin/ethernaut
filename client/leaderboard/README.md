# Blockchain Crawler

A simple trawler, crawler, and general miscrient for finding, decoding and writing datas from logs on Ethereum chains running official versions of Open Zeppelin's Ethernaut.

Completed using Alchemy.

To ensure project is initialised & correct dependancies are installed

`npm install alchemy-sdk`

&

`npm install alch/alchemy-web3`

&

`npm install web3`

# Ethernaut

This code has been uploaded **filled with majestic data points**, but can be ran from scratch if need be.

Here's the process that needs to be taken pre cron job deployment.

- run `yarn leaderboard:oldCrawler` successfully, writing the network-by-network `${network.name}PlayersBoard`'s
- run `yarn leaderboard:triggerNextCrawl` to populate each ${network.name}PlayersBoard with new entries & write the global leaderboard

**NB.** _Be sure to initialise `allPlayersBoard.json` and `newPlayersBoard.js` with an empty array `[]` if modifying the scripts._

**NB.** _Any automator/action triggers a crawl from the block defined as `lastFrom` under `utils/networkDetails` per network. At the end of each run, this `fromBlock` value is updated. As such, if testing, be sure to omit the `updateNetworkDetails` function until you are happy to leave the action running on whatever period.




