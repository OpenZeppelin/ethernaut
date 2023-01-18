# Blockchain Crawler

A simple trawler, crawler, and general miscrient for finding, decoding and writing datas from logs on Ethereum chains running official versions of Open Zeppelin's Ethernaut.

Adaptable with some small-ish tub of elbow greease, and completed using Alchemy/Infura.

To ensure project is initialised & correct dependancies are installed

`npm install alchemy-sdk`

&

`npm install alch/alchemy-web3`

&

`npm install web3`

# Ethernaut

This code has been uploaded **filled with majestic data points**, but can be ran from scratch if need be.

Here's the process that needs to be taken **if starting from scratch**.:

- run `yarn leaderboard:oldCrawler` successfully, writing the network-by-network `${network.name}PlayersBoard`'s

**If you're OZ**, it's crawled its crawl and populated historical data already, right up to a very recent block indeed. 
Check it out in `/client/leaderboard/utils/networkDetails` > `"fromBlock"` for each network. 

## All the cron job needs to do is trigger this right here:


- run `yarn leaderboard:triggerNextCrawl` to populate each ${network.name}PlayersBoard with new entries & write the global leaderboard

...as often as you like. A draft of this `.yml` file is contained in the `/client/leaderboard` directory as `crondraft.yml`.

**NB.** *_Be sure to initialise `allPlayersBoard.json` and `newPlayersBoard.js` with an empty array `[]` if starting from scratch.*

**NB.** *_Any automator/action triggers a crawl from the block defined as `lastFrom` under `utils/networkDetails` per network. At the end of each run, this `fromBlock` value is updated. As such, if testing, be sure to omit the `updateNetworkDetails` function until you are happy to leave the action running on whatever period.*

**NB** *_during a cron job action crawl, `try/catch` blocks are used to omit RPC errors/missing responses. These are **not tracked** in this PR, and subsequently, although rare, occaisionally data on chain will not reflect that as shown on the leaderboard.*



