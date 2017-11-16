# The Ethernaut

(WIP)
<p>The ethernaut is a Web3/Solidity based wargame inspired in <a href="https://overthewire.org" target="_blank" rel="noopener noreferred">overthewire.org</a> and in the comic <a href="https://en.wikipedia.org/wiki/The_Eternaut" target="_blank" rel="noopener noreferred">El Eternauta</a>, to be played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'.</p>

### Running locally (development)

0. `git clone ...` and `npm install` as usual.
1. Start deterministic testrpc with `npm run rpc` (to stop `npm run killrpc`).
2. You might want to import one of the private keys in scripts/rpc.sh to your Metamask wallet.
2. Set target network ACTIVE_NETWORK in constants.js.
4. Deploy contracts with `npm run deploy:contracts`.
5. Start react client with `npm start`.
6. To run solidity tests `truffle test`.

### Level development

1. Develop level contract in contracts/levels. Levels must extend contracts/base/Level.sol for basic game compatibility. Levels emit instances whose state can be modified by players, and check such state to determine if the player has completed the level.
2. Be nice and add a test xD
3. Add an entry to gamedata/gamedata.json for the level. This will be used by the contract deployment script to automatically deploy and upload the contract to Ethernaut.sol.
4. Create and edit gamedata/descriptions/levels/xxx.md and xxx_complete.md. One will be shown on the level's page and the other when the level is completed). Note that your entry in gamedata.json must point to these md files.

### Deployment

To deploy the react app use `npm run deploy:ui`. Of course, you will need ssh credentials for this.

To deploy the contracts on ropsten, first set the ACTIVE_NETWORK variable in constants.js and then edit gamedata.json. This file keeps a history of all level instances in each level data's deployed_ropsten array. To deploy a new instance, add an "x" entry to the array, like so:

```
"deployed_ropsten": [
  "x",
  "0x4b1d5eb6cd2849c7890bcacd63a6855d1c0e79d5",
  "0xdf51a9e8ce57e7787e4a27dd19880fd7106b9a5c"
],
```

Then run `npm run deploy:contracts`. This action will effectively deploy a new version of the level data item whose deployed_ropsten array was updated, and will point the ethernaut dapp to use this new deployed contract instance for the level.
