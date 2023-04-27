import prompt from "prompt";
import colors from "colors";
import fs from "fs";
import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import * as ethutil from "../src/utils/ethutil.js";
import * as constants from "../src/constants.js";
import * as EthernautABI from "contracts/build/contracts/Ethernaut.sol/Ethernaut.json" assert { type: "json" };
import * as ProxyStatsABI from "contracts/build/contracts/proxy/ProxyStats.sol/ProxyStats.json" assert { type: "json" };
import * as ProxyAdminABI from "contracts/build/contracts/proxy/ProxyAdmin.sol/ProxyAdmin.json" assert { type: "json" };
import * as ImplementationABI from "contracts/build/contracts/metrics/Statistics.sol/Statistics.json" assert { type: "json" };
import * as SupersederImplementationABI from "contracts/build/contracts/metrics/StatisticsLevelSuperseder.sol/StatisticsLevelSuperseder.json" assert { type: "json" };

import gamedata from "../src/gamedata/gamedata.json" assert { type: "json" };
const levels = gamedata.levels;

// For testing purposes in a local fork uncomment one of the following lines to get forked network deployment data.
const DEPLOY_DATA_PATH = `./client/src/gamedata/deploy.${constants.NETWORKS.GOERLI.name}.json`;
// const DEPLOY_DATA_PATH = `./client/src/gamedata/deploy.${constants.NETWORKS.MUMBAI.name}.json`;
// const DEPLOY_DATA_PATH = `./client/src/gamedata/deploy.${constants.NETWORKS.SEPOLIA.name}.json`;
// const DEPLOY_DATA_PATH = `./client/src/gamedata/deploy.${constants.NETWORKS.OPTIMISM_GOERLI.name}.json`;
// const DEPLOY_DATA_PATH = `./client/src/gamedata/deploy.${constants.NETWORKS.ARBITRUM_GOERLI.name}.json`;
// const DEPLOY_DATA_PATH = `./client/src/gamedata/deploy.local.json`;

// For real purposes
//const DEPLOY_DATA_PATH = `./client/src/gamedata/deploy.${constants.ACTIVE_NETWORK.name}.json`;

const DeployData = await loadDeployData(DEPLOY_DATA_PATH);

// Operator address, the account that will perform the data dump (meant to be ethernaut owner).
//const OPERATOR_ADDRESS = ADDRESSES.ACTIVE_NETWORK.name;
const OPERATOR_ADDRESS = "0x09902A56d04a9446601a0d451E07459dC5aF0820";

// Contract Objects
let web3;
let ethernaut;
let proxyStats;
let proxyStatsWithImplementationABI;
let proxyStatsWithSupersederImplementationABI;
let proxyAdmin;
let statsImplementation;
let statsSupersederImplementation;

// Dump stages enum
const DumpStage = {
  INIT: 0,
  SET_ADDRESSES: 1,
  LEVEL_FIRST_INSTANCE_CREATION_TIME: 2,
  LEVEL_FIRST_COMPLETION_TIME: 3,
  PLAYER_STATS: 4,
  LEVEL_STATS: 5,
  LEVEL_EXISTS_AND_LEVELS_ARRAY_FIX: 6,
  DUMP_DONE: 7,
};


async function supersede() {
  let oldAddress;
  let newAddress;
  // check if there is a pending process
  if ((await web3.eth.getStorageAt(proxyStats.address, 17)).slice(-1) == "1") {
    console.log(colors.bold.red("Pending level replacement detected, resuming..."));
    oldAddress = await proxyStatsWithSupersederImplementationABI.methods[
      "oldLevelContractAddress()"
    ]();
    newAddress = await proxyStatsWithSupersederImplementationABI.methods[
      "newLevelContractAddress()"
    ]();
    console.log(
      colors.grey(
        ` DumpStage: ${
          (await proxyStatsWithSupersederImplementationABI.methods["dumpStage()"]()).words[0]
        }`
      )
    );
    console.log(colors.gray(` From: ${oldAddress}`));
    console.log(colors.gray(` To: ${newAddress}`));
  } else {
    // Print available levels list
    console.log(
      colors.bold.yellow(
        "\nOpenZeppelin-Ethernaut contract level replacement tool, available levels:\n"
      )
    );
    levels.forEach((level) => {
      console.log(` ${colors.red(level.deployId)}) ${colors.cyan(level.name)}`);
    });

    // Get operator's level choice
    console.log(colors.bold.yellow("\nWhich deployId do you want to supersede?"));
    const LevelToBeSupersededData = await getLevelToBeSupersededData();

    // Check if level is registered into ethernaut and is not already superseded
    if (!(await isLevelRegistered(LevelToBeSupersededData))) {
      console.log(colors.bold.red("Level is not registered in Ethernaut"));
      process.exit();
    }
    if (!(await doesLevelExistsInStatistics(LevelToBeSupersededData))) {
      console.log(colors.bold.red("Level is already superseded"));
      process.exit();
    }

    // Print level info
    await printLevelInfo(LevelToBeSupersededData);

    // Confirm substitution by operator
    console.log(colors.bold.yellow("\nConfirm substitution?"));
    if (!(await operatorConfirmation(LevelToBeSupersededData))) {
      console.log(colors.bold.red("Substitution not confirmed by operator"));
      process.exit();
    }

    // Upgrade Statistics
    await upgradeStatisticsToStatisticsSuperseder();

    // Deploy new version const newLevelContract
    const newLevelContract = await deployLevel(LevelToBeSupersededData);

    // Update deploy data object
    const ret = storeSubstitutionInDeployData(newLevelContract, LevelToBeSupersededData);

    oldAddress = ret.oldAddress;
    newAddress = ret.newAddress;

    // Register new address in ethernaut
    await registerLevelInEthernaut(newAddress, LevelToBeSupersededData);

    // Set replacement addresses
    await setSubstitutionAddresses(oldAddress, newAddress);
  }
  // Dump Statistics data
  await dumpData(oldAddress, newAddress);

  // Clean used storage slots
  await cleanStorage();

  // // Print edited storage slots
  // // await printEditedStorageSlots(oldAddress, newAddress);

  // Downgrade Statistics
  await downgradeStatisticsSupersederToStatisticsAndSaveDeployData();

  process.exit();
}

prompt.start();
await initWeb3();
await loadGameContracts();
await supersede();

async function getLevelToBeSupersededData() {
  const options = {
    properties: {
      deployId: {
        description: "deployId",
        required: true,
      },
    },
  };

  const { deployId } = await prompt.get(options);
  if (deployId >= levels.length || deployId < 0) {
    console.log(colors.bold.red("deployId entered must be in the list"));
    process.exit();
  }

  return levels[deployId];
}

async function isLevelRegistered(level) {
  const levelAddress = DeployData[level.deployId];
  return await ethernaut.methods["registeredLevels(address)"](levelAddress);
}

async function doesLevelExistsInStatistics(level) {
  const levelAddress = DeployData[level.deployId];
  return await proxyStatsWithImplementationABI.methods["doesLevelExist(address)"](levelAddress);
}

async function printLevelInfo(level) {
  const levelAddress = DeployData[level.deployId];
  const FailedSubmissions = await proxyStatsWithImplementationABI.methods[
    "getNoOfFailedSubmissionsForLevel(address)"
  ](levelAddress);
  const CompletedSubmissions = await proxyStatsWithImplementationABI.methods[
    "getNoOfCompletedSubmissionsForLevel(address)"
  ](levelAddress);
  const InstancesForLevel = await proxyStatsWithImplementationABI.methods[
    "getNoOfInstancesForLevel(address)"
  ](levelAddress);

  console.log(colors.bold.yellow(`\nSelected level data:`));
  console.log(` Name: ${colors.green(level.name)}`);
  console.log(` Address: ${colors.green(levelAddress)}`);
  console.log(` Failed submissions: ${colors.green(FailedSubmissions.toString())}`);
  console.log(` Completed submissions: ${colors.green(CompletedSubmissions.toString())}`);
  console.log(` Instances: ${colors.green(InstancesForLevel.toString())}`);
}

async function upgradeStatisticsToStatisticsSuperseder() {
  console.log(colors.bold.yellow("\nUgrading statistics contract to statisticsSuperseder..."));

  const props = {
    gasPrice: parseInt(await web3.eth.getGasPrice() * 1.10),
    gas: 4500000,
  };
  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if (!from) from = (await web3.eth.getAccounts())[0];

  // Deploy SupersederImplementation
  console.log(colors.grey(` Deploying StatisticsLevelSuperseder.sol...`));
  const SupersederImplementationContract = await ethutil.getTruffleContract(
    SupersederImplementationABI.default,
    {
      from,
    }
  );
  statsSupersederImplementation = await SupersederImplementationContract.new(props);
  await web3.eth.getTransactionReceipt(statsSupersederImplementation.transactionHash);
  console.log(colors.grey(" Done!"), "✅");
  console.log(` SupersederImplementation: ${statsSupersederImplementation.address}`);

  // Upgrade and set operator and on maintenance flag
  const initEncodedCall = web3.eth.abi.encodeFunctionCall(
    {
      name: "setOperator",
      type: "function",
      inputs: [
        {
          type: "address",
          name: "_operator",
        },
      ],
    },
    [OPERATOR_ADDRESS]
  );

  console.log(colors.grey(` Upgrading Proxy...`));
  const tx = await proxyAdmin.methods["upgradeAndCall(address,address,bytes)"](
    proxyStats.address,
    statsSupersederImplementation.address,
    initEncodedCall,
    { from, ...props }
  );
  await web3.eth.getTransactionReceipt(tx.tx);
  console.log(colors.grey(` Proxy is upgraded! ✅`));

  // Check if onMaintenance is true
  if ((await web3.eth.getStorageAt(proxyStats.address, 17)).slice(-1) != "1") {
    console.log(colors.bold.red("Error onMaintenance not set"));
    process.exit();
  }
}

async function deployLevel(level) {
  console.log(
    colors.bold.yellow(`\nDeploying ${level.levelContract}, deployId: ${level.deployId}...`)
  );

  const LevelABI = JSON.parse(
    fs.readFileSync(
      `contracts/build/contracts/levels/${level.levelContract}/${
        level.levelContract.split(".")[0]
      }.json`,
      "utf-8"
    )
  );

  const props = {
    gasPrice: parseInt(await web3.eth.getGasPrice() * 1.10),
    gas: 4500000,
  };

  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if (!from) from = (await web3.eth.getAccounts())[0];

  const LevelContract = await ethutil.getTruffleContract(LevelABI, { from });
  const newLevelContract = await LevelContract.new(...level.deployParams, props);
  await web3.eth.getTransactionReceipt(newLevelContract.transactionHash);
  console.log(colors.grey(" Done!"), "✅");
  console.log(" new Address:", colors.bold.green(`${newLevelContract.address}`));

  return newLevelContract;
}

function storeSubstitutionInDeployData(newLevelContract, level) {
  console.log(colors.gray(` Registering operation in ${DEPLOY_DATA_PATH}`));
  console.log(colors.gray(` ${DeployData[level.deployId]} --> ${newLevelContract.address}`));

  if (!DeployData.supersededAddresses) {
    DeployData.supersededAddresses = [];
  }

  const i = DeployData.supersededAddresses.push({
    oldAddress: DeployData[level.deployId],
    newAddress: newLevelContract.address,
  });

  DeployData[level.deployId] = newLevelContract.address;
  DeployData.implementation = statsSupersederImplementation.address;

  storeDeployData(DEPLOY_DATA_PATH);
  return DeployData.supersededAddresses[i - 1];
}

async function registerLevelInEthernaut(newAddress, level) {
  console.log(colors.bold.yellow("\nRegistering level in Ethernaut contract..."));

  const props = {
    gasPrice: parseInt(await web3.eth.getGasPrice() * 1.10),
    gas: 450000,
  };

  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if (!from) from = (await web3.eth.getAccounts())[0];

  await ethernaut.methods["registerLevel(address)"](newAddress, { from, ...props });
  //Check
  if (!(await isLevelRegistered(level))) {
    console.log(colors.bold.red("New address level not registered in Ethernaut"));
    process.exit();
  }
  if (!(await doesLevelExistsInStatistics(level))) {
    console.log(colors.bold.red("New address level not registered in Statistics"));
    process.exit();
  }
  console.log(colors.grey(" Done!"), "✅");
}

async function setSubstitutionAddresses(oldAddress, newAddress) {
  // Set substitution level addresses
  console.log(colors.grey(" Setting substitution addresses in StatisticsLevelSuperseder..."));
  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if (!from) from = (await web3.eth.getAccounts())[0];

  const props = {
    gasPrice: parseInt(await web3.eth.getGasPrice() * 1.10),
    gas: 450000,
  };
  let tx = await proxyStatsWithSupersederImplementationABI.methods[
    "setSubstitutionAddresses(address,address)"
  ](oldAddress, newAddress, { from, ...props });
  await web3.eth.getTransactionReceipt(tx.tx);

  // Check that addresses are correct
  const oldAddressFromContract = await proxyStatsWithSupersederImplementationABI.methods[
    "oldLevelContractAddress()"
  ]();
  if (oldAddress != oldAddressFromContract) {
    console.log(colors.bold.red("Old address is not set correctly"));
    process.exit();
  }

  const newAddressFromContract = await proxyStatsWithSupersederImplementationABI.methods[
    "newLevelContractAddress()"
  ]();
  if (newAddress != newAddressFromContract) {
    console.log(colors.bold.red("New address is not set correctly"));
    process.exit();
  }
  console.log(colors.grey(" Done!"), "✅");
}

async function dumpData(oldAddress, newAddress) {
  console.log(colors.bold.yellow("\nDumping statistics data..."));
  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if (!from) from = (await web3.eth.getAccounts())[0];

  const props = {
    gasPrice: parseInt(await web3.eth.getGasPrice() * 1.10),
    gas: 2000000, // gas can be tuned here 2000000
  };

  let dumpStage;
  do {
    dumpStage = (await proxyStatsWithSupersederImplementationABI.methods["dumpStage()"]()).words[0];

    switch (dumpStage) {
      case DumpStage.SET_ADDRESSES: //1
      case DumpStage.LEVEL_FIRST_INSTANCE_CREATION_TIME: //2
        // Dump LevelFirstInstanceCreationTime
        console.log(colors.grey(" Dumping LevelFirstInstanceCreationTime"));

        do {
          console.log(
            colors.grey(
              " Dumped ",
              (await proxyStatsWithSupersederImplementationABI.methods["usersArrayIndex()"]())
                .words[0],
              "Players"
            )
          );

          let tx = await proxyStatsWithSupersederImplementationABI.methods[
            "dumpLevelFirstInstanceCreationTime()"
          ]({ from, ...props });
          await web3.eth.getTransactionReceipt(tx.tx);

          dumpStage = await proxyStatsWithSupersederImplementationABI.methods["dumpStage()"]();
        } while (dumpStage != DumpStage.LEVEL_FIRST_COMPLETION_TIME);

        console.log(colors.grey(" Done!"), "✅");
        break;

      case DumpStage.LEVEL_FIRST_COMPLETION_TIME: //3
        // Dump levelFirstCompletionTime
        console.log(colors.grey(" Dumping levelFirstCompletionTime"));

        do {
          console.log(
            colors.grey(
              " Dumped ",
              (await proxyStatsWithSupersederImplementationABI.methods["usersArrayIndex()"]())
                .words[0],
              "Players"
            )
          );

          let tx = await proxyStatsWithSupersederImplementationABI.methods[
            "dumpLevelFirstCompletionTime()"
          ]({ from, ...props });
          await web3.eth.getTransactionReceipt(tx.tx);

          dumpStage = await proxyStatsWithSupersederImplementationABI.methods["dumpStage()"]();
        } while (dumpStage != DumpStage.PLAYER_STATS);
        console.log(colors.grey(" Done!"), "✅");
        break;

      case DumpStage.PLAYER_STATS: //4
        // Dump playerStats
        console.log(colors.grey(" Dumping playerStats"));

        do {
          console.log(
            colors.grey(
              " Dumped ",
              (await proxyStatsWithSupersederImplementationABI.methods["usersArrayIndex()"]())
                .words[0],
              "Players"
            )
          );
          let tx = await proxyStatsWithSupersederImplementationABI.methods["dumpPlayerStats()"]({
            from,
            ...props,
          });
          await web3.eth.getTransactionReceipt(tx.tx);

          dumpStage = await proxyStatsWithSupersederImplementationABI.methods["dumpStage()"]();
        } while (dumpStage != DumpStage.LEVEL_STATS);
        console.log(colors.grey(" Done!"), "✅");
        break;

      case DumpStage.LEVEL_STATS: //5
        // Dump levelStats
        console.log(colors.grey(" Dumping levelStats"));
        {
          let tx = await proxyStatsWithSupersederImplementationABI.methods["dumpLevelStats()"]({
            from,
            ...props,
          });
          await web3.eth.getTransactionReceipt(tx.tx);
        }
        console.log(colors.grey(" Done!"), "✅");
        break;

      case DumpStage.LEVEL_EXISTS_AND_LEVELS_ARRAY_FIX: //6
        // Fix levelExist mapping and levels array
        console.log(colors.grey(" fixing levelExist mapping and levels array"));
        {
          let tx = await proxyStatsWithSupersederImplementationABI.methods[
            "fixLevelExistAndLevelsArray()"
          ]({
            from,
            ...props,
          });
          await web3.eth.getTransactionReceipt(tx.tx);
        }
        console.log(colors.grey(" Done!"), "✅");

        break;
    }
  } while (dumpStage != DumpStage.DUMP_DONE);
}

async function cleanStorage() {
  console.log(colors.bold.yellow(" Cleaning used storage slots..."));
  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if (!from) from = (await web3.eth.getAccounts())[0];

  const props = {
    gasPrice: parseInt(await web3.eth.getGasPrice() * 1.10),
    gas: 450000,
  };

  let tx = await proxyStatsWithSupersederImplementationABI.methods["cleanStorage()"]({
    from,
    ...props,
  });
  await web3.eth.getTransactionReceipt(tx.tx);
  console.log(colors.grey(" Done!"), "✅");
}

async function printEditedStorageSlots(oldAddress, newAddress) {
  console.log(colors.bold.yellow(" Checking operation..."));
  console.log(`old address: ${oldAddress} new address: ${newAddress}`);
  const totalPlayers = await proxyStatsWithSupersederImplementationABI.methods[
    "getTotalNoOfPlayers()"
  ]();
  let usersArrayIndex = 0;
  // loop over all users
  while (usersArrayIndex < totalPlayers) {
    let userAddress = await proxyStatsWithSupersederImplementationABI.methods[
      "getPlayerAtIndex(uint256)"
    ](usersArrayIndex);

    console.log(
      `old: player ${usersArrayIndex} : ${userAddress}`,
      (
        await proxyStatsWithSupersederImplementationABI.methods[
          "getLevelFirstInstanceCreationTime(address,address)"
        ](userAddress, oldAddress)
      ).words[0]
    );
    usersArrayIndex++;
  }

  usersArrayIndex = 0;
  // loop over all users
  while (usersArrayIndex < totalPlayers) {
    let userAddress = await proxyStatsWithSupersederImplementationABI.methods[
      "getPlayerAtIndex(uint256)"
    ](usersArrayIndex);

    console.log(
      `new: player ${usersArrayIndex} : ${userAddress}`,
      (
        await proxyStatsWithSupersederImplementationABI.methods[
          "getLevelFirstInstanceCreationTime(address,address)"
        ](userAddress, newAddress)
      ).words[0]
    );
    usersArrayIndex++;
  }

  console.log("-------------------------------------------------");

  usersArrayIndex = 0;
  // loop over all users
  while (usersArrayIndex < totalPlayers) {
    let userAddress = await proxyStatsWithSupersederImplementationABI.methods[
      "getPlayerAtIndex(uint256)"
    ](usersArrayIndex);

    console.log(
      `old: player ${usersArrayIndex} : ${userAddress}`,
      (
        await proxyStatsWithSupersederImplementationABI.methods[
          "getLevelFirstCompletionTime(address,address)"
        ](userAddress, oldAddress)
      ).words[0]
    );
    usersArrayIndex++;
  }

  usersArrayIndex = 0;
  // loop over all users
  while (usersArrayIndex < totalPlayers) {
    let userAddress = await proxyStatsWithSupersederImplementationABI.methods[
      "getPlayerAtIndex(uint256)"
    ](usersArrayIndex);

    console.log(
      `new: player ${usersArrayIndex} : ${userAddress}`,
      (
        await proxyStatsWithSupersederImplementationABI.methods[
          "getLevelFirstCompletionTime(address,address)"
        ](userAddress, newAddress)
      ).words[0]
    );
    usersArrayIndex++;
  }

  console.log("-------------------------------------------------");

  usersArrayIndex = 0;
  // loop over all users
  while (usersArrayIndex < totalPlayers) {
    let userAddress = await proxyStatsWithSupersederImplementationABI.methods[
      "getPlayerAtIndex(uint256)"
    ](usersArrayIndex);

    console.log(
      `old: player ${usersArrayIndex} : ${userAddress}`,
      await proxyStatsWithSupersederImplementationABI.methods["getPlayerStats(address,address)"](
        userAddress,
        oldAddress
      )
    );
    usersArrayIndex++;
  }

  usersArrayIndex = 0;
  // loop over all users
  while (usersArrayIndex < totalPlayers) {
    let userAddress = await proxyStatsWithSupersederImplementationABI.methods[
      "getPlayerAtIndex(uint256)"
    ](usersArrayIndex);

    console.log(
      `new: player ${usersArrayIndex} : ${userAddress}`,
      await proxyStatsWithSupersederImplementationABI.methods["getPlayerStats(address,address)"](
        userAddress,
        newAddress
      )
    );
    usersArrayIndex++;
  }

  console.log("-------------------------------------------------");
  console.log("Levels stats");

  console.log(
    `LevelStats[${oldAddress}]`,
    await proxyStatsWithSupersederImplementationABI.methods["getLevelStats(address)"](oldAddress)
  );

  console.log(
    `LevelStats[${newAddress}]`,
    await proxyStatsWithSupersederImplementationABI.methods["getLevelStats(address)"](newAddress)
  );

  console.log("-------------------------------------------------");
  console.log("Levels Exist");

  console.log(
    `levelExists[${oldAddress}]`,
    await proxyStatsWithSupersederImplementationABI.methods["getLevelExists(address)"](oldAddress)
  );

  console.log(
    `levelExists[${newAddress}]`,
    await proxyStatsWithSupersederImplementationABI.methods["getLevelExists(address)"](newAddress)
  );

  console.log("-------------------------------------------------");
  console.log("Levels array");
  let levelsArrayLength = await proxyStatsWithSupersederImplementationABI.methods[
    "getTotalNoOfEthernautLevels()"
  ]();
  console.log(`length ${levelsArrayLength}`);
  let arrayIndex = 0;
  do {
    console.log(
      `arrayIndex: ${arrayIndex}`,
      await proxyStatsWithSupersederImplementationABI.methods["getLevelAddress(uint256)"](
        arrayIndex
      )
    );
    arrayIndex++;
  } while (arrayIndex < levelsArrayLength);
}

async function downgradeStatisticsSupersederToStatisticsAndSaveDeployData() {
  console.log(colors.bold.yellow("\nDowngrading statisticsSuperseder contract to statistics..."));

  const props = {
    gasPrice: parseInt(await web3.eth.getGasPrice() * 1.10),
    gas: 4500000,
  };
  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if (!from) from = (await web3.eth.getAccounts())[0];

  // Deploy Implementation
  console.log(colors.grey(` Upgrading Proxy...`));
  const tx = await proxyAdmin.methods["upgrade(address,address)"](
    proxyStats.address,
    "0x7000E0F2F5A389DF14b50c6F84686123F19b27F6",
    { from, ...props }
  );

  await web3.eth.getTransactionReceipt(tx.tx);
  console.log(colors.grey(` Proxy is downgraded! ✅`));

  DeployData.implementation = statsImplementation.address;
  storeDeployData(DEPLOY_DATA_PATH);
}
async function loadGameContracts() {
  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if (!from) from = (await web3.eth.getAccounts())[0];

  // Ethernaut
  const Ethernaut = await ethutil.getTruffleContract(EthernautABI.default, {
    from,
  });
  ethernaut = await Ethernaut.at(DeployData.ethernaut);

  // Statistics proxy
  const ProxyStats = await ethutil.getTruffleContract(ProxyStatsABI.default, {
    from,
  });
  proxyStats = await ProxyStats.at(DeployData.proxyStats);

  // Statistics proxy with implementation ABI to call functions with proxy state
  const ProxyStatsWithImplementationABI = await ethutil.getTruffleContract(
    ImplementationABI.default,
    {
      from,
    }
  );
  proxyStatsWithImplementationABI = await ProxyStatsWithImplementationABI.at(DeployData.proxyStats);

  // Statistics proxy with superseder implementation ABI to call functions with proxy state
  const ProxyStatsWithSupersederImplementationABI = await ethutil.getTruffleContract(
    SupersederImplementationABI.default,
    {
      from,
    }
  );
  proxyStatsWithSupersederImplementationABI = await ProxyStatsWithSupersederImplementationABI.at(
    DeployData.proxyStats
  );

  // Statistics proxy admin
  const ProxyAdmin = await ethutil.getTruffleContract(ProxyAdminABI.default, {
    from,
  });
  proxyAdmin = await ProxyAdmin.at(DeployData.proxyAdmin);

  // Statistics implementation
  const StatsImplementation = await ethutil.getTruffleContract(ImplementationABI.default, {
    from,
  });
  statsImplementation = await StatsImplementation.at(DeployData.implementation);
}

function loadDeployData(path) {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (err) {
    return {};
  }
}

function storeDeployData(path) {
  console.log(colors.green(`Writing updated deploy data: ${path}`));
  return fs.writeFileSync(path, JSON.stringify(DeployData, null, 2), "utf8");
}

async function initWeb3() {
  return new Promise(async (resolve, reject) => {
    let provider;
    if (constants.ACTIVE_NETWORK === constants.NETWORKS.LOCAL) {
      const providerUrl = `${constants.ACTIVE_NETWORK.url}:${constants.ACTIVE_NETWORK.port}`;
      console.log(colors.gray(` connecting web3 to '${providerUrl}'...`));
      provider = new Web3.providers.HttpProvider(providerUrl);
    } else {
      provider = new HDWalletProvider(
        constants.ACTIVE_NETWORK.privKey,
        constants.ACTIVE_NETWORK.url
      );
    }

    web3 = new Web3(provider);
    //ethutil.setWeb3(web3);

    web3.eth.net.isListening((err, res) => {
      if (err) {
        console.log(" error connecting web3:", err);
        reject();
        return;
      }
      console.log(colors.gray(` web3 connected: ${res}\n`));
      ethutil.setWeb3(web3);
      resolve();
    });
  });
}

async function operatorConfirmation() {
  const options = {
    properties: {
      confirmSubstitution: {
        pattern: new RegExp("^[yYnN]$"),
        description: `(y/n)`,
        message: "invalid input",
      },
    },
  };

  const { confirmSubstitution } = await prompt.get(options);
  return confirmSubstitution === "y" || confirmSubstitution === "Y";
}
