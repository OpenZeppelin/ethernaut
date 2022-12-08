---
name: New Network Support
about: Create your request to add a new network support.
title: New Network Support - [Network Name]
labels: ''
assignees: ''

---

This Issue is raised to add a support for a new network. To raise a PR for this issue, please follow the steps mentioned below.

## Before you submit this issue

Make sure you have done the following transactions -
- Deployment of the following core contracts:
  - `Ethernaut.sol`
  - `Statistics.sol`
  - `ProxyAdmin.sol`
  - `ProxyStats.sol`
- `ProxyStats.sol` has been set in `Ethernaut.sol` by calling `setStatistics()`.
- All the levels' contracts:
  - Have been deployed.
  - Are registered in the `Ethernaut.sol` by calling `registerLevel()`.

Make sure that the following checks are passing.
- [ ] `ethernaut.address` in the console returns a valid address.
- [ ] For all the levels:
  - [ ] You can visit them.
  - [ ] You can create their instances.
  - [ ] `instance` in the console returns a valid address after creating the instance.

And after all the above checks are passed...
- [ ] You have transferred the ownership of the `Ethernaut.sol` contract to the OpenZeppeling account (`0x09902A56d04a9446601a0d451E07459dC5aF0820`) by running `window.transferOwnerShip(0x09902A56d04a9446601a0d451E07459dC5aF0820)` in the browser console.

That's it! Now you can submit this issue :D

# To raise a Pull Request for this Issue

Take note of the following things before you start. Because you will need them further while preparing the PR.
- [ ] A short `name` of the network. For example: goerli-optimism, mumbai-polygon, sepolia, etc.
- [ ] An `ALL_CAPS_NAME` for internal code. This is mostly the capitalised form of the above name with hyphens replaced by underscores.
- [ ] A `chain_id` of the blockchain on which you have deployed the contracts.
- [ ] The `currencyName` of the chain. For example: Optimism-ETH, Mumbai-Matic, Sepolia-ETH, etc. 
- [ ] The `currencySymbol` of the chain. For example: ETH, MATIC, SEP, etc.
- [ ] An `rpcUrl` for the network. For example: https://eth-goerli.public.blastapi.io, https://matic-mumbai.chainstacklabs.com, https://rpc.sepolia.org, etc.
- [ ] A `blockExplorer` URL of the network. For example: https://goerli.etherscan.io, https://mumbai.polygonscan.com, https://sepolia.etherscan.io, etc.
- [ ] Addresses of all the contracts of the game:
  - [ ] `Ethernaut.sol`
  - [ ] `Statistics.sol`
  - [ ] `ProxyAdmin.sol`
  - [ ] `ProxyStats.sol`
  - [ ] All the level addresses. (`level` in the console. **NOT** `instance`)

## File edits

Make sure you have followed the below steps:

- [ ] Added an entry in `NETWORKS` in [./client/src/constants.js](./client/src/constants.js) like this:
```
  ALL_CAPS_NAME: {
    name: 'name',
    id: 'chain_id',
    url: `${process.env.ALL_CAPS_NAME_HOST}`,
    privKey: `${process.env.PRIV_KEY}`
  },
```
- [ ] Added an entry in `NETWORKS_INGAME` in [./client/src/constants.js](./client/src/constants.js) like this:
```
  ALL_CAPS_NAME: {
    name: 'name',
    id: 'chain_id',
    currencyName: 'currencyName',
    currencySymbol: "currencySymbol",
    rpcUrl: `rpcUrl`,
    blockExplorer: 'blockExplorer'
  },
```
- [ ] Added an entry in `ADDRESSES` in [./client/src/constants.js](./client/src/constants.js) like this:
```
  [NETWORKS.ALL_CAPS_NAME.name]: '0x09902A56d04a9446601a0d451E07459dC5aF0820',
```
- [ ] Added a commented line just before `export const ACTIVE_NETWORK = NETWORKS.LOCAL;` in [./client/src/constants.js](./client/src/constants.js) like this:
```
  // export const ACTIVE_NETWORK = NETWORKS.ALL_CAPS_NAME
```
- [ ] Created a JSON new file in [./client/src/gamedata](./client/src/gamedata) directory with name `deploy.name.json`.
- [ ] Provided the addresses of all the contracts in this file like below, and replaced all the `x` with their contract addresses in the network(This data can be gotten by running` await window.loadContracts()` in the browser console).
```
{
  "0": "x",
  "1": "x",
  "2": "x",
  "3": "x",
  "4": "x",
  "5": "x",
  "6": "x",
  "7": "x",
  "8": "x",
  "9": "x",
  "10": "x",
  "11": "x",
  "12": "x",
  "13": "x",
  "14": "x",
  "15": "x",
  "16": "x",
  "17": "x",
  "18": "x",
  "19": "x",
  "20": "x",
  "21": "x",
  "22": "x",
  "23": "x",
  "24": "x",
  "25": "x",
  "26": "x",
  "27": "x",
  "ethernaut": "x",
  "implementation": "x",
  "proxyAdmin": "x",
  "proxyStats": "x"
}
```

#### All looks good now! Please raise the PR :)


## Review checklist to check if the issue is resolved
In the corresponding PR:
- [ ] Verify the above checklist.
- [ ] Review all the code files changes.
- [ ] Start the project on this branch.
- [ ] Run the following and check if it returns `true`.
```
(await ethernaut.owner()) === '0x09902A56d04a9446601a0d451E07459dC5aF0820'
``` 
- [ ] Navigate all the levels and check if they are playable.
