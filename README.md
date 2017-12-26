# The Ethernaut

![ethernaut](./public/imgs/bann.jpeg)

<p>The ethernaut is a Web3/Solidity based wargame inspired in <a href="https://overthewire.org" target="_blank" rel="noopener noreferred">overthewire.org</a> and in the comic <a href="https://en.wikipedia.org/wiki/The_Eternaut" target="_blank" rel="noopener noreferred">El Eternauta</a>, to be played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'.</p>

The game acts both as a tool for those interested in learning ethereum, and as a way to catalogue historical hacks in levels. Levels can be infinite and the game does not require to be played in any particular order.

*Level PR's are welcome!*

### Deployed Versions

You can find the current, official version at:
[ethernaut.zeppelin.solutions](https://ethernaut.zeppelin.solutions)

You can find the DEVCON3 version (ctf contest) at:
[ethernaut-devcon3.zeppelin.solutions](https://ethernaut-devcon3.zeppelin.solutions)

### Running locally (development)

1. Install
```
git clone git@github.com:OpenZeppelin/ethernaut.git
npm install
```
2. Start deterministic testrpc
```
npm run rpc
```
3. You might want to import one of the private keys in scripts/rpc.sh to your Metamask wallet.
4. Set target network `ACTIVE_NETWORK` in constants.js.
5. Compile contracts
```
npx truffle compile
```
6. Deploy contracts
```
npm run deploy:contracts
```
7. Start react client
```
npm start
```
8. Run solidity tests with
```
npx truffle test
```

### Level development

1. Develop level contract in contracts/levels. Levels must extend contracts/base/Level.sol for basic game compatibility. Levels emit instances whose state can be modified by players, and check such state to determine if the player has completed the level.
2. Be nice and add a test xD
3. Add an entry to gamedata/gamedata.json for the level. This will be used by the contract deployment script to automatically deploy and upload the contract to Ethernaut.sol.
4. Create and edit gamedata/descriptions/levels/xxx.md and xxx_complete.md. One will be shown on the level's page and the other when the level is completed). Note that your entry in gamedata.json must point to these md files.

### Example level development: King

Let's suppose that we are creating the level "King" (which is already created and available in the game of course).

0. For this repo, clone and npm install.
1. Use the other levels as a basis, eg. duplicate DummyFactory.sol and Dummy.sol.
2. Rename and modify the contracts to KingFactory.sol and King.sol.
3. Implement the desired instance and factory logic in solidity. See current levels and notes to understand how the game mechanics work.
4. Edit test/LevelTests.js and add a test. In this case, look for the "King" section.
5. Run truffle test and once all tests pass, register the level in gamedata/gamedata.json. This file is used by the app to display data, connect to contracts, etc. It is also used by the contract deployer script in scripts/deploy_contracts.
6. The level should now show up in the ui. To start it, set src/constants.js' ACTIVE_NETWORK to DEVELOPMENT and run npm start.
7. Add a description markdwon file, in this case gamedata/levels/king.md (make sure gamedata.json points to it). This content will now be displayed in the ui for the level.
8. Verify that the level is playable and winnable.
9. Add a completed description markdown file, in this case gamedata/levels/king_complete.md (make sure gamedata.json points to it). The level will display this as additional info once the level is solved, usually to include historical information related to the level.
8. Make a PR request so that we can re-deploy the game with the new level!

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
