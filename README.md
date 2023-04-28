# Ethernaut
 
[![Twitter Follow](https://img.shields.io/twitter/follow/OpenZeppelin?style=plastic&logo=twitter)](https://twitter.com/OpenZeppelin)
[![OpenZeppelin Forum](https://img.shields.io/badge/Ethernaut%20Forum%20-discuss-blue?style=plastic&logo=discourse)](https://forum.openzeppelin.com/tag/ethernaut)

Ethernaut is a Web3/Solidity based wargame inspired by [overthewire](https://overthewire.org), to be played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'.

The game acts both as a tool for those interested in learning ethereum, and as a way to catalogue historical hacks as levels. There can be an infinite number of levels and the game does not require to be played in any particular order.

## Deployed Versions

You can find the current, official version at: [ethernaut.openzeppelin.com](https://ethernaut.openzeppelin.com)

## Install and Build

There are three components to Ethernaut that are needed to run/deploy in order to work with it locally:

- Test Network - A testnet that is running locally, like ganache, hardhat network, geth, etc
- Contract Deployment - In order to work with the contracts, they must be deployed to the locally running testnet
- The Client/Frontend - This is a React app that runs locally and can be accessed on localhost:3000

In order to install, build, and run Ethernaut locally, follow these instructions:

0. Be sure to use a compatible Node version. If you use `nvm` you can run `nvm use` at the root level to be sure to select a compatible version.

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

5. Set `client/src/constants.js` `ACTIVE_NETWORK` to `NETWORKS.LOCAL`
6. Deploy contracts

    ```bash
    yarn deploy:contracts
    ```

7. Start Ethernaut locally

    ```bash
    yarn start:ethernaut
    ```

### Running locally (goerli network)

The same as using the local network but steps 2, 3 and 6 are not necessary.

In this case, replace point 5 with:
5. Set `client/src/constants.js` `ACTIVE_NETWORK` to `NETWORKS.GOERLI`

### Running tests

```bash
yarn test:contracts
```

### Building

```bash
yarn build:ethernaut
```

### Deploying

You will normally need to deploy it on a local network, for this you can just run `yarn deploy:contracts` and all the contracts will be deployed on your local node running on `localhost:8545` and you will be able to check each level address in the `deploy.local.json` file.

To deploy the contracts on Goerli, first set the `ACTIVE_NETWORK` variable in `constants.js` and then edit `deploy.goerli.json`. This file keeps a history of all level and contract instances. To deploy a new instance, add an "x" entry to the array, like so:

```json
{
  "0": "x",
  "1": "0x4b1d5eb6cd2849c7890bcacd63a6855d1c0e79d5",
  "2": "0xdf51a9e8ce57e7787e4a27dd19880fd7106b9a5c",
  ...
},
```

Then run `yarn deploy:contracts`.

## Contributing

Contributions and corrections are always welcome!

Please follow the [Contributor's Guide](./CONTRIBUTING.md) if you would like to help out.
