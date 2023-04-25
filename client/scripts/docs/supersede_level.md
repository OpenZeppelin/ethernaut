# OZ-Ethernaut contract level replacement tool

## **Description**

Change the contract code directly in the repo will change the front-end contract but not the on-chain bytecode of that level. Therefore, while players try to attack a level instance, the front-end will show a different contract than what they actually have to attack, they may differ with function names for example (i.e. selectors).

[`supersede_level.mjs`](https://github.com/OpenZeppelin/ethernaut/blob/master/client/scripts/supersede_level.mjs) script implements a tool to supersede contract deployed on-chain when it will be required (when vulnerable code displayed on the front-end will not exactly match the deployed contracts).

The tool performs the substitution by following these steps:
- Deploys new level contract.
- Registers level in Ethernaut.sol
- Upgrades Statistics.sol to StatisticsLevelSuperseder.sol, a implementation that contains the logic to change statistics storage:
    - levelFirstInstanceCreationTime - dump from old level address to new one.
    - levelFirstCompletionTime - dump from old level address to new one.
    - playerStats - dump from old level address to new one.
    - levelStats - dump from old level address to new one.
    - levelExists - set false old level address.
    - levels - fix supersede old level with new one and wipe extra entry.
- Dumps the data 
- Downgrades the Statistics.sol to original one.

All this process is required in order to avoid to the users to resolve both versions and score double, maintain the statistics of a specific level, and maintain the consistency of the leaderboard scores.

## **Usage**

### **Testnet (mainet for ethernaut XD)**

- Select the network in the [`constants.js`](https://github.com/OpenZeppelin/ethernaut/blob/client/src/constants.js) file by uncommenting the `ACTIVE_NETWORK` constant.

- run the tool:
```bash
yarn run supersede:level
```

The tool will guide the operator through the process. Operator is the account that will trigger the storage dump operations in the statistics contract. Operator address can be changed by editing script's `OPERATOR_ADDRESS` constant, although it is recommended that this be ethernaut's owner.

The script contains a commented function `printEditedStorageSlots(oldAddress, newAddress)` that can be uncommented to prompt in the terminal all storage slots edited after the process. 

### **Test in local fork**

- Set ethernaut owner as main account in the hardhat local node by adding following configuration to [`hardhat.config.js`](https://github.com/OpenZeppelin/ethernaut/blob/master/contracts/hardhat.config.js)
```javascript

...

const ownerPrivKey = process.env.PRIV_KEY;

module.exports = {

...

    networks: {
        hardhat: {
            chainId: 1337,
            accounts: [{ privateKey: ownerPrivKey, balance: "1000000000000000000000" }],
        },
    },
};
```

- Uncomment script's `DEPLOY_DATA_PATH` constant to match with forked network.
- Set script's `OPERATOR_ADDRESS` constant manually.
- Run hardhat local node with forked network (command must be executed in `./contracts`, relative to project root):
```
yarn hardhat --max-memory 8192  node --fork <provider api url>
```
- Run tool as testnet. 
