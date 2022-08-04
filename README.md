# Ethernaut

[![Twitter Follow](https://img.shields.io/twitter/follow/OpenZeppelin?style=plastic&logo=twitter)](https://twitter.com/OpenZeppelin)
[![OpenZeppelin Forum](https://img.shields.io/badge/Ethernaut%20Forum%20-discuss-blue?style=plastic&logo=discourse)](https://forum.openzeppelin.com/tag/ethernaut)

Ethernaut is a Web3/Solidity based wargame inspired by [overthewire](https://overthewire.org), to be played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'.

The game acts both as a tool for those interested in learning ethereum, and as a way to catalogue historical hacks as levels. There can be an infinite number of levels and the game does not require to be played in any particular order.

## Deployed Versions

You can find the current, official version at: [ethernaut.openzeppelin.com](https://ethernaut.openzeppelin.com)

## Install and Build

There are three components to Ethernaut that are needed to run/deploy in order to work with it locally:

- Test Network - A testnet that is running locally, like gnache, hardhat network, geth, etc
- Contract Deployment - In order to work with the contracts, they must be deployed to the locally running testnet
- The Client/Frontend - This is a React app that runs locally and can be accessed on localhost:3000

In order to install, build, and run Ethernaut locally, follow these instructions:

1. Clone the repo and install dependencies:

    ```bash
    git clone git@github.com:OpenZeppelin/ethernaut.git
    yarn install
    ```

2. Start deterministic rpc

    ```bash
    yarn network
    ```

3. Import one of the private keys from the ganache-cli output to your Metamask wallet.
4. Compile contracts

    ```bash
    yarn compile:contracts
    ```

5. Set client/src/constants.js ACTIVE_NETWORK to NETWORKS.LOCAL
6. Deploy contracts

    ```bash
    yarn deploy:contracts
    ```

7. Start Ethernaut locally

    ```bash
    yarn start:ethernaut
    ```

### Running locally (ropsten network)

The same as using the local network but steps 2, 3 and 6 are not necessary.

In this case, replace point 5 with:
5. Set client/src/constants.js ACTIVE_NETWORK to NETWORKS.ROPSTEN

### Running tests

```bash
yarn test:contracts
```

### Building

```bash
yarn build:ethernaut
```

### Level development

*A level is composed of the following elements:*

* A `level factory` contract that needs to extend Level.sol. This factory contract will be deployed only once and registered on Ethernaut.sol by Ethernaut's owner. Players never interact with the factory directly. The factory is in charge of creating level instances for players to use (1 instance per player) and to check these instances to verify if the player has beat the level. Factories should not have state that can be changed by the player.
* A `level instance` contract that is emitted by the factory for each player that requests it. Instances need to be completely decouppled from Ethernaut's architecture. Factories will emit them and verify them. That is, level instances don't know anything about their factories or Ethernaut. An instance's state can be completely demolished by players and even destroyed since they are not really part of the architecture, just a challenge for a player to use at will.
* A `description file` in client/src/gamedata/descriptions that the UI presents to the player and describes the level's objectives with some narrative and tips.
* A `description completion file` also in client/src/gamedata/descriptions that the UI presents to the player when the level is beaten, that presents further information about the player, historical insights, further explanations or just a congrats message.
* A `tests file` in contracts/test/levels that performs unit tests on the level.
* A `json entry` for the level in client/src/gamedata/gamedata.json that appends metadata to the level. The UI uses this metadata to display the level's title, difficulty, etc, but also to determine if sources are shown, the default gas for the creation of an instance, etc. NOTE: "deployId" must be unique and is also used by the deployment script.
* Optionally, an `author entry` at client/src/gamedata/authors.json. You can specify opt-in information about yourself in this file.

#### Example level development: King

Let's suppose that we are creating the level "King" (which is already created and available in the game of course).

1. Fork this repo, clone and npm install.
2. Use the other levels as a basis, eg. duplicate DummyFactory.sol and Dummy.sol.
3. Rename and modify the contracts to KingFactory.sol and King.sol.
4. Implement the desired instance and factory logic in solidity. See current levels and notes to understand how the game mechanics work.
5. Add contracts/test/levels/King.test.js file. Use other tests files as reference to see how tests might work.
6. Run `yarn test:contracts` and once all tests pass, register the level in client/src/gamedata/gamedata.json.
7. The level should now show up in the ui. To start the UI, set client/src/constants.js' ACTIVE_NETWORK to NETWORKS.LOCAL and run npm start.
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

```json
"deployed_ropsten": [
  "x",
  "0x4b1d5eb6cd2849c7890bcacd63a6855d1c0e79d5",
  "0xdf51a9e8ce57e7787e4a27dd19880fd7106b9a5c"
],
```

Then run `yarn deploy:contracts`. This action will effectively deploy a new version of the level data item whose deployed_ropsten array was updated, and will point the ethernaut dapp to use this new deployed contract instance for the level.

### Modify or add new languages
 
To modify or add a new language to the list of supported ones follow these steps:

Please follow the [Contributor's Guide](./CONTRIBUTING.md) if you would like to help out.
