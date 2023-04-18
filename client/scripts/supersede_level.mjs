import prompt from "prompt";
import colors from "colors";
import fs from "fs";
import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import * as ethutil from "../src/utils/ethutil.js";
import * as EthernautABI from "contracts/build/contracts/Ethernaut.sol/Ethernaut.json" assert { type: "json" };
import * as constants from "../src/constants.js";
import gamedata from "../src/gamedata/gamedata.json" assert { type: "json" };

let web3;
let ethernaut;
let proxyAdmin;
let implementation;
let proxyStats;

const DEPLOY_DATA_PATH = `./client/src/gamedata/deploy.${constants.ACTIVE_NETWORK.name}.json`;
const deployData = await loadDeployData(DEPLOY_DATA_PATH);

//REMEMBER TO INCLUDE CONTRACT COMPILATION IN PACKAGE.JSON SCRIPT

async function supersede() {
  const LevelToBeSuperseded = await getLevelToBeSuperseded();

  if (!(await isLevelDeployed(LevelToBeSuperseded))) {
    throw "Level is not deployed";
  }

  console.log(LevelToBeSuperseded.name, " currently deployed at");
}

prompt.start();
await initWeb3();
await loadContracts();
await supersede();

async function getLevelToBeSuperseded() {
  // Print available levels list
  const levels = gamedata.levels;
  console.log();
  console.log(
    "OpenZeppelin-Ethernaut contract level replacement script, available levels:\n"
  );
  levels.forEach((level) => {
    console.log(`${level.deployId}) ${level.name}`);
  });
  console.log();
  // Get prompt deployId and returns  a promise that resolves to selected Level data
  console.log("Which deployId do you want to supersede?");
  return new Promise((resolve, reject) => {
    const options = {
      properties: {
        deployId: {
          description: "deployId",
          required: true,
        },
      },
    };
    prompt.get(options, (err, res) => {
      if (err) return reject(err);
      if (res.deployId >= levels.length || res.deployId < 0)
        throw "deployId entered must be in the list";
      resolve(levels[res.deployId]);
    });
  });
}

async function isLevelDeployed(level) {
  return new Promise(async (resolve, reject) => {
    const levelAddress = deployData[level.deployId];
    console.log(levelAddress)
    resolve(await ethernaut.methods['registeredLevels(address)'](levelAddress) );
  });
}

async function initWeb3() {
  return new Promise(async (resolve, reject) => {
    let provider;
    if (constants.ACTIVE_NETWORK === constants.NETWORKS.LOCAL) {
      const providerUrl = `${constants.ACTIVE_NETWORK.url}:${constants.ACTIVE_NETWORK.port}`;
      console.log(colors.gray(`connecting web3 to '${providerUrl}'...`));
      provider = new Web3.providers.HttpProvider(providerUrl);
    } else {
      provider = new HDWalletProvider(
        constants.ACTIVE_NETWORK.privKey,
        constants.ACTIVE_NETWORK.url
      );
    }

    web3 = new Web3(provider);

    web3.eth.net.isListening((err, res) => {
      if (err) {
        console.log("error connecting web3:", err);
        reject();
        return;
      }
      console.log(colors.gray(`web3 connected: ${res}\n`));
      ethutil.setWeb3(web3);
      resolve();
    });
  });
}

async function loadContracts() {
  const props = {
    gasPrice: (await web3.eth.getGasPrice()) * 10,
    gas: 30000000,
  };

  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if (!from) from = (await web3.eth.getAccounts())[0];
  
  // Ethernaut
  const Ethernaut = await ethutil.getTruffleContract(EthernautABI.default, {
    from,
  });
  ethernaut = await Ethernaut.at(deployData.ethernaut);

}

function loadDeployData(path) {
    try {
      return JSON.parse(fs.readFileSync(path, "utf8"));
    } catch (err) {
      return {};
    }
  }
  