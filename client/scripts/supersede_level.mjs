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
let web3;
let ethernaut;
let proxyStats;
let proxyStatsWithImplementationABI;
let proxyAdmin;
let statsImplementation;

// For testing purposes by forking network
// To run a forked network with ethernaut owner account as hardhat network account add following configuration in hardhat.config.js
/*
 require("dotenv").config({ path: __dirname + "/.env" });
 const ownerPrivKey = process.env.PRIV_KEY;
 ...
    hardhat: {
    chainId: 1337,
    accounts: [{ privateKey: ownerPrivKey, balance: "1000000000000000000000" }],
  },
 */
// then uncomment one of the following lines to get forked network deployment data.
const DeployData = await loadDeployData(
  `./client/src/gamedata/deploy.${constants.NETWORKS.GOERLI.name}.json`
);
// const DeployData = await loadDeployData(`./client/src/gamedata/deploy.${constants.NETWORKS.MUMBAI.name}.json`);
// const DeployData = await loadDeployData(`./client/src/gamedata/deploy.${constants.NETWORKS.SEPOLIA.name}.json`);
// const DeployData = await loadDeployData(`./client/src/gamedata/deploy.${constants.NETWORKS.OPTIMISM_GOERLI.name}.json`);
// const DeployData = await loadDeployData(`./client/src/gamedata/deploy.${constants.NETWORKS.ARBITRUM_GOERLI.name}.json`);

// For real purposes
//const DEPLOY_DATA_PATH = `./client/src/gamedata/deploy.${constants.ACTIVE_NETWORK.name}.json`;
//const DeployData = await loadDeployData(DEPLOY_DATA_PATH);

// REMEMBER THAT OPERATOR ADDRESS IS HARDCODED IN upgradeStatisticsToStatisticsSuperseder();
//REMEMBER TO INCLUDE CONTRACT COMPILATION IN PACKAGE.JSON SCRIPT//

async function supersede() {
  // CHECK IF THERE IS A PENDING SUBSTITUTION.
  console.log((await web3.eth.getStorageAt(proxyStats.address, 17)).slice(-1));

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
  const { oldAddress, newAddress } = storeSubstitutionInDeployData(
    newLevelContract,
    LevelToBeSupersededData
  );

  // Register new address in ethernaut
  await registerLevelInEthernaut(newAddress, LevelToBeSupersededData);

  // Dump Statistics data
  await dumpData(oldAddress, newAddress);
  

  // Check correctness compare backup - onchain data
  console.log(colors.bold.yellow("Checking that the operation was right..."));

  // Downgrade Statistics
  console.log(
    colors.bold.yellow("Downgrading statisticsSuperseder contract to original statistics...")
  );

  // PROXY IMPLEMENTATION ADDRESS MUST BE MODIFIED IM DEPLOY.{NETWORK}.DATA
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
    gasPrice: (await web3.eth.getGasPrice()) * 10,
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
  const supersederImplementationContract = await SupersederImplementationContract.new(props);
  await web3.eth.getTransactionReceipt(supersederImplementationContract.transactionHash);
  console.log(colors.grey(" Done!"), "✅");
  console.log(` SupersederImplementation: ${supersederImplementationContract.address}`);

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
    [`0x09902A56d04a9446601a0d451E07459dC5aF0820`] //Hardcoded is BAD!
  );

  console.log(colors.grey(` Upgrading Proxy...`));
  const tx = await proxyAdmin.methods["upgradeAndCall(address,address,bytes)"](
    proxyStats.address,
    supersederImplementationContract.address,
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
    gasPrice: (await web3.eth.getGasPrice()) * 10,
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
  console.log(colors.gray(` registering operation in deploy.${constants.NETWORKS.GOERLI.name}.json`));
  console.log(colors.gray(` ${DeployData[level.deployId]} --> ${newLevelContract.address}`));

  if (!DeployData.supersededAddresses) {
    DeployData.supersededAddresses = [];
  }

  const i = DeployData.supersededAddresses.push({
    oldAddress: DeployData[level.deployId],
    newAddress: newLevelContract.address,
  });
  DeployData[level.deployId] = newLevelContract.address;

  storeDeployData(`./client/src/gamedata/deploy.${constants.NETWORKS.GOERLI.name}.json`)
  return DeployData.supersededAddresses[i - 1];
}

async function registerLevelInEthernaut(newAddress, level) {
  console.log(colors.bold.yellow("\nRegistering level in Ethernaut contract..."));
  
  const props = {
    gasPrice: (await web3.eth.getGasPrice()) * 10,
    gas: 4500000,
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
}

async function dumpData(oldAddress, newAddress){
  console.log(colors.bold.yellow("Dumping statistics data..."));

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

  // Statistics proxy with implementation ABI to call implementation functions with proxy state
  const ProxyStatsWithImplementationABI = await ethutil.getTruffleContract(
    ImplementationABI.default,
    {
      from,
    }
  );
  proxyStatsWithImplementationABI = await ProxyStatsWithImplementationABI.at(DeployData.proxyStats);

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

