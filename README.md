# Ethernaut

<p>Ethernaut is a Web3/Solidity based wargame inspired in <a href="https://overthewire.org" target="_blank" rel="noopener noreferrer">overthewire.org</a>, to be played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'.</p>

The game acts both as a tool for those interested in learning ethereum, and as a way to catalogue historical hacks in levels. Levels can be infinite and the game does not require to be played in any particular order.

*Level PR's are welcome!*

### Deployed Versions

You can find the current, official version at:
[ethernaut.openzeppelin.com](https://ethernaut.openzeppelin.com)

### Running locally (local network)

1. Install
```
git clone git@github.com:OpenZeppelin/ethernaut.git
yarn install
```
2. Start deterministic rpc
```
yarn network
```
3. You might want to import one of the private keys from ganache-cli to your Metamask wallet.
4. Compile contracts
```
yarn compile:contracts
```
5. Set client/src/constants.js ACTIVE_NETWORK to NETWORKS.LOCAL
6. Deploy contracts
```
yarn deploy:contracts
```
7. Start Ethernaut locally
```
yarn start:ethernaut
```

### Running locally (ropsten network)

The same as using the local network but steps 2, 3 and 6 are not necessary.

In this case, replace point 5 with:
5. Set client/src/constants.js ACTIVE_NETWORK to NETWORKS.ROPSTEN

### Running tests

```
yarn test:contracts
```

### Building

```
yarn build:ethernaut
```

### Level development

*A level is composed of the following elements:*

* A `level factory` contract that needs to extend Level.sol. This factory contract will be deployed only once and registered on Ethernaut.sol by Ethernaut's owner. Players never interact with the factory directly. The factory is in charge of creating level instances for players to use (1 instance per player) and to check these instances to verify if the player has beat the level. Factories should not have state that can be changed by the player.
* A `level instance` contract that is emitted by the factory for each player that requests it. Instances need to be completely decouppled from Ethernaut's architecture. Factories will emit them and verify them. That is, level instances don't know anything about their factories or Ethernaut. An instance's state can be completely demolished by players and even destroyed since they are not really part of the architecture, just a challenge for a player to use at will.
* A `description file` in client/gamedata/descriptions that the UI presents to the player and describes the level's objectives with some narrative and tips.
* A `description completion file` also in client/gamedata/descriptions that the UI presents to the player when the level is beaten, that presents further information about the player, historical insights, further explanations or just a congrats message.
* A `tests file` in contracts/test/levels that performs unit tests on the level.
* A `json entry` for the level in client/gamedata/gamedata.json that appends metadata to the level. The UI uses this metadata to display the level's title, difficulty, etc, but also to determine if sources are shown, the default gas for the creation of an instance, etc. NOTE: "deployId" must be unique and is also used by the deployment script.
* Optionally, an `author entry` at client/gamedata/authors.json. You can specify opt-in information about yourself in this file.

#### Example level development: King

Let's suppose that we are creating the level "King" (which is already created and available in the game of course).

1. Fork this repo, clone and npm install.
2. Use the other levels as a basis, eg. duplicate DummyFactory.sol and Dummy.sol.
3. Rename and modify the contracts to KingFactory.sol and King.sol.
4. Implement the desired instance and factory logic in solidity. See current levels and notes to understand how the game mechanics work.
5. Add contracts/test/levels/King.test.js file. Use other tests files as reference to see how tests might work.
6. Run `yarn test:contracts` and once all tests pass, register the level in client/gamedata/gamedata.json.
7. The level should now show up in the ui. To start the UI, set client/src/constants.js' ACTIVE_NETWORK to DEVELOPMENT and run npm start.
8. Add a description markdown file, in this case client/src/gamedata/levels/king.md (make sure gamedata.json points to it). This content will now be displayed in the ui for the level.
9. Verify that the level is playable and winnable via UI. It is common for levels to be beatable in some way in tests that doesn't work using the UI, so it is important to test it manually as well.
10. Add a completed description markdown file, in this case client/src/gamedata/levels/king_complete.md (make sure gamedata.json points to it). The level will display this as additional info once the level is solved, usually to include historical information related to the level.
11. Make a PR request so that we can re-deploy the game with the new level!

### Build

 ```
 yarn build:ethernaut
 ```

### Deployment

To deploy the contracts on ropsten, first set the ACTIVE_NETWORK variable in constants.js and then edit gamedata.json. This file keeps a history of all level instances in each level data's deployed_ropsten array. To deploy a new instance, add an "x" entry to the array, like so:

```
"deployed_ropsten": [
  "x",
  "0x4b1d5eb6cd2849c7890bcacd63a6855d1c0e79d5",
  "0xdf51a9e8ce57e7787e4a27dd19880fd7106b9a5c"
],
```

Then run `yarn deploy:contracts`. This action will effectively deploy a new version of the level data item whose deployed_ropsten array was updated, and will point the ethernaut dapp to use this new deployed contract instance for the level.

### Adding new languages

To add a new language to the list of supported ones follow these steps:

1. under `client/src/gamedata` create a new folder with the languge you want to add. 

2. Copy paste the entire content of any other language into the new directory.

3. You will need to translate two things:
  - pages and level descriptions under `descriptions` subdirectory
  - `strings.json`. For this, only the values of the keys in the json must be translated. Do not translate keys (i.e. `nextLevel`).

4. Add a new key/value in all `strings.json` of all languages for the newly added language. For example, if you're going to add French, add

```
In `en/strings.json` add:

{
  ...
  "french": "French",
  ...
}

In `es/strings.json` add:
{
  ...
  "french": "Francés",
  ...
}
```
And so on with all other languages present.

5. Once translation is done, add an entry in `client/src/containers/Headers.js` in the language picker for the user interface so you can select your added language:

```
<li>
  <select style={{fontSize: 'small'}} onChange={this.changeLanguage.bind(this)} value={this.state.lang ? this.state.lang : 'en'}>
      <option value="en">{strings.english}</option>
      <option value="es">{strings.spanish}</option>
      ---> ADD AN ENTRY HERE <---
    </select>
</li>
```
