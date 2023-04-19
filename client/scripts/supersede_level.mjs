import prompt from "prompt";
import colors from "colors";
import fs from "fs";
import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import * as ethutil from "../src/utils/ethutil.js";
import * as EthernautABI from "contracts/build/contracts/Ethernaut.sol/Ethernaut.json" assert { type: "json" };
import * as ProxyStatsABI from "contracts/build/contracts/proxy/ProxyStats.sol/ProxyStats.json" assert { type: "json" };
import * as ProxyAdminABI from "contracts/build/contracts/proxy/ProxyAdmin.sol/ProxyAdmin.json" assert { type: "json" };
import * as ImplementationABI from "contracts/build/contracts/metrics/Statistics.sol/Statistics.json" assert { type: "json" };

import * as constants from "../src/constants.js";
import gamedata from "../src/gamedata/gamedata.json" assert { type: "json" };
import { resolve } from "path";

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
const oldDeployData = await loadDeployData(
  `./client/src/gamedata/deploy.${constants.NETWORKS.GOERLI.name}.json`
);
// const oldDeployData = await loadDeployData(`./client/src/gamedata/deploy.${constants.NETWORKS.MUMBAI.name}.json`);
// const oldDeployData = await loadDeployData(`./client/src/gamedata/deploy.${constants.NETWORKS.SEPOLIA.name}.json`);
// const oldDeployData = await loadDeployData(`./client/src/gamedata/deploy.${constants.NETWORKS.OPTIMISM_GOERLI.name}.json`);
// const oldDeployData = await loadDeployData(`./client/src/gamedata/deploy.${constants.NETWORKS.ARBITRUM_GOERLI.name}.json`);

// For real purposes
//const DEPLOY_DATA_PATH = `./client/src/gamedata/deploy.${constants.ACTIVE_NETWORK.name}.json`;
//const oldDeployData = await loadDeployData(DEPLOY_DATA_PATH);
const newDeployData = oldDeployData;

//REMEMBER TO INCLUDE CONTRACT COMPILATION IN PACKAGE.JSON SCRIPT//

async function supersede() {
  // Print available levels list
  console.log(
    colors.bold.yellow(
      "\nOpenZeppelin-Ethernaut contract level replacement script, available levels:\n"
    )
  );
  levels.forEach((level) => {
    console.log(` ${colors.red(level.deployId)}) ${colors.cyan(level.name)}`);
  });

  // Get operator level choice
  console.log(colors.bold.yellow("\nWhich deployId do you want to supersede?"));
  const LevelToBeSuperseded = await getLevelToBeSuperseded();

  // Check if level is registered into ethernaut and is not already superseded
  if (!(await isLevelRegistered(LevelToBeSuperseded))) throw "Level is not deployed";
  if (!(await doesLevelExistsInStatistics(LevelToBeSuperseded)))
    throw "Level is already superseded";

  // Print level info
  await printLevelInfo(LevelToBeSuperseded);

  // Confirm substitution by operator
  console.log(colors.bold.yellow("\nConfirm substitution?"));
  if (!(await operatorConfirmation(LevelToBeSuperseded)))
    throw "Substitution not confirmed by operator";

  // Deploy new version
  await deployLevel(LevelToBeSuperseded);

  // Register new address in ethernaut
  console.log(colors.bold.yellow("Registering level in ethernaut contract..."));

  // Backup
  console.log(colors.bold.yellow("Generating data backup json to allow easy recovery..."));

  // Upgrade Statistics
  console.log(colors.bold.yellow("ugrading statistics contract to statisticsSuperseder..."));

  // Dump Statistics data
  console.log(colors.bold.yellow("Dumping statistics data..."));

  // Check correctness compare backup - onchain data
  console.log(colors.bold.yellow("Checking that the operation was right..."));

  // Downgrade Statistics
  console.log(
    colors.bold.yellow("Downgrading statisticsSuperseder contract to original statistics...")
  );
}

prompt.start();
await initWeb3();
await loadGameContracts();
await supersede();

async function getLevelToBeSuperseded() {
  const options = {
    properties: {
      deployId: {
        description: "deployId",
        required: true,
      },
    },
  };

  const { deployId } = await prompt.get(options);
  if (deployId >= levels.length || deployId < 0) throw "deployId entered must be in the list";

  return levels[deployId];
}

async function isLevelRegistered(level) {
  const levelAddress = oldDeployData[level.deployId];
  return await ethernaut.methods["registeredLevels(address)"](levelAddress);
}

async function doesLevelExistsInStatistics(level) {
  const levelAddress = oldDeployData[level.deployId];
  return await proxyStatsWithImplementationABI.methods["doesLevelExist(address)"](levelAddress);
}

async function printLevelInfo(level) {
  const levelAddress = oldDeployData[level.deployId];
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

async function deployLevel(level) {
  console.log(`\n Deploying ${level.levelContract}, deployId: ${level.deployId}...`);

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
    gas: 30000000,
  };

  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if (!from) from = (await web3.eth.getAccounts())[0];

  //const Contract = await ethutil.getTruffleContract(LevelABI, { from });
  //const contract = await Contract.new(...level.deployParams, props);


  /// TODO FIX ERROR HERE, EXECUTIONS DO NOT FINALIZE

  
  
  
  // console.log(colors.grey("\n Done!"),"✅");
  // console.log(" new Address", colors.bold.green(`${contract.address}`));
  // oldDeployData[level.deployId] = contract.address;
  // console.log(
  //   colors.gray(`  storing deployed id: ${level.deployId} with address: ${contract.address}`)
  // );
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
    ethutil.setWeb3(web3);

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

async function loadGameContracts() {
  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if (!from) from = (await web3.eth.getAccounts())[0];

  // Ethernaut
  const Ethernaut = await ethutil.getTruffleContract(EthernautABI.default, {
    from,
  });
  ethernaut = await Ethernaut.at(oldDeployData.ethernaut);

  // Statistics proxy
  const ProxyStats = await ethutil.getTruffleContract(ProxyStatsABI.default, {
    from,
  });
  proxyStats = await ProxyStats.at(oldDeployData.proxyStats);

  // Statistics proxy with implementation ABI to call implementation functions with proxy state
  const ProxyStatsWithImplementationABI = await ethutil.getTruffleContract(
    ImplementationABI.default,
    {
      from,
    }
  );
  proxyStatsWithImplementationABI = await ProxyStatsWithImplementationABI.at(
    oldDeployData.proxyStats
  );

  // Statistics proxy admin
  const ProxyAdmin = await ethutil.getTruffleContract(ProxyAdminABI.default, {
    from,
  });
  proxyAdmin = await ProxyAdmin.at(oldDeployData.proxyAdmin);

  // Statistics implementation
  const StatsImplementation = await ethutil.getTruffleContract(ImplementationABI.default, {
    from,
  });
  statsImplementation = await StatsImplementation.at(oldDeployData.implementation);
}

function loadDeployData(path) {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (err) {
    return {};
  }
}

/*
function storeDeployData(path, deployData) {
  console.log(colors.green(`Writing updated deploy data: ${path}`));
  return fs.writeFileSync(path, JSON.stringify(deployData, null, 2), "utf8");
}*/
