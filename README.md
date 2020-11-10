# Ethernaut

<p>Ethernaut is a Web3/Solidity based wargame inspired in <a href="https://overthewire.org" target="_blank" rel="noopener noreferred">overthewire.org</a>, to be played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'.</p>

The game acts both as a tool for those interested in learning ethereum, and as a way to catalogue historical hacks in levels. Levels can be infinite and the game does not require to be played in any particular order.

*Level PR's are welcome!*

### Deployed Versions

You can find the current, official version at:
[ethernaut.openzeppelin.com](https://ethernaut.openzeppelin.com)

### Running locally (local network)

1. Install
```
git clone git@github.com:OpenZeppelin/ethernaut.git
npm install
```
2. Start deterministic rpc
```
npm run ganache
```
3. You might want to import one of the private keys from ganache-cli to your Metamask wallet.
4. Compile contracts
```
npx truffle compile
```
5. Set src/constants.js ACTIVE_NETWORK to NETWORKS.LOCAL
6. Deploy contracts
```
npm run deploy:contracts
```
7. Start react client
```
npm start
```

### Running locally (ropsten network)

The same as using the local network but steps 2, 3 and 6 are not necessary.

In this case, replace point 5 with:
5. Set src/constants.js ACTIVE_NETWORK to NETWORKS.ROPSTEN

### Running tests

```
npx truffle test
```

### Level development

*A level is composed of the following elements:*

* A `level factory` contract that needs to extend Level.sol. This factory contract will be deployed only once and registered on Ethernaut.sol by Ethernaut's owner. Players never interact with the factory directly. The factory is in charge of creating level instances for players to use (1 instance per player) and to check these instances to verify if the player has beat the level. Factories should not have state that can be changed by the player.
* A `level instance` contract that is emitted by the factory for each player that requests it. Instances need to be completely decouppled from Ethernaut's architecture. Factories will emit them and verify them. That is, level instances don't know anything about their factories or Ethernaut. An instance's state can be completely demolished by players and even destroyed since they are not really part of the architecture, just a challenge for a player to use at will.
* A `description file` in gamedata/descriptions that the UI presents to the player and describes the level's objectives with some narrative and tips.
* A `description completion file` also in gamedata/descriptions that the UI presents to the player when the level is beaten, that presents further information about the player, historical insights, further explanations or just a congrats message.
* A `tests file` in test/levels that performs unit tests on the level.
* A `json entry` for the level in gamedata/gamedata.json that appends metadata to the level. The UI uses this metadata to display the level's title, difficulty, etc, but also to determine if sources are shown, the default gas for the creation of an instance, etc. NOTE: "deployId" must be unique and is also used by the deployment script.
* Optionally, an `author entry` at gamedata/authors.json. You can specify opt-in information about yourself in this file.

#### Example level development: King

Let's suppose that we are creating the level "King" (which is already created and available in the game of course).

1. Fork this repo, clone and npm install.
2. Use the other levels as a basis, eg. duplicate DummyFactory.sol and Dummy.sol.
3. Rename and modify the contracts to KingFactory.sol and King.sol.
4. Implement the desired instance and factory logic in solidity. See current levels and notes to understand how the game mechanics work.
5. Add test/levels/King.test.js file. Use other tests files as reference to see how tests might work.
6. Run truffle test and once all tests pass, register the level in gamedata/gamedata.json.
7. The level should now show up in the ui. To start the UI, set src/constants.js' ACTIVE_NETWORK to DEVELOPMENT and run npm start.
8. Add a description markdown file, in this case gamedata/levels/king.md (make sure gamedata.json points to it). This content will now be displayed in the ui for the level.
9. Verify that the level is playable and winnable via UI. It is common for levels to be beatable in some way in tests that doesn't work using the UI, so it is important to test it manually as well.
10. Add a completed description markdown file, in this case gamedata/levels/king_complete.md (make sure gamedata.json points to it). The level will display this as additional info once the level is solved, usually to include historical information related to the level.
11. Make a PR request so that we can re-deploy the game with the new level!

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
