import * as ethutil from '../utils/ethutil';
import * as actions from '../actions';
import { loadTranslations } from '../utils/translations';
import * as constants from "../constants";

let language = localStorage.getItem('lang');
let strings = loadTranslations(language);

const loadLevelInstance = (store) => (next) => (action) => {
  if (action.type !== actions.LOAD_LEVEL_INSTANCE) return next(action);

  const state = store.getState();
  if (!state.network.web3 || !state.contracts.ethernaut) {
    console.error(`@bad ${strings.ethernautNotFoundMessage}`);
    return next(action);
  } else if (!state.player.address) {
    console.error(`@bad ${strings.noPlayerAddressMessage}`);
    return next(action);
  }

  // Recover old instance address from local cache?
  let instanceAddress;

  if (action.instanceAddress) instanceAddress = action.instanceAddress;
  else if (action.reuse) {
    const cache = state.player.emittedLevels[action.level.deployedAddress];
    if (cache) instanceAddress = cache;
  }

  // Get a new instance address
  if (!instanceAddress && !action.reuse) {
    console.asyncInfo(`@good ${strings.requestingNewInstanceMessage}`);

    const showErr = function (error) {
      console.error(
        `@bad ${strings.unableToRetrieveLevelMessage}`,
        error || ''
      );
    };

    const estimate = parseInt(action.level.instanceGas, 10) || 2000000;
    const deployFunds = state.network.web3.utils.toWei(
      parseFloat(action.level.deployFunds, 10).toString(),
      'ether'
    );
    let maxPriorityFeePerGas = state.network.web3.utils.toWei('2.5', 'gwei');
    state.network.web3.eth.getBlock('latest').then((block) => {
      var blockBaseFee = block.baseFeePerGas ? block.baseFeePerGas : 1;
      
      // Try EIP-1559
      if(
        state.network.networkId.toString() === constants.NETWORKS.MUMBAI.id ||
        state.network.networkId.toString() === constants.NETWORKS.SEPOLIA.id ||
        state.network.networkId.toString() === constants.NETWORKS.GOERLI.id
      ) {
        state.contracts.ethernaut
        .createLevelInstance(action.level.deployedAddress, {
          gas: 2*estimate.toString(),
          maxPriorityFeePerGas: maxPriorityFeePerGas,
          maxFeePerGas: 2 * Number(blockBaseFee) + Number(maxPriorityFeePerGas),
          from: state.player.address,
          value: deployFunds,
        })
        .then((tx) => {
          console.dir(tx);

          for(var i = 0; i<tx.logs.length; i++) {
            if(tx.logs[i].event === "LevelInstanceCreatedLog") {
              instanceAddress = tx.logs[i].args.instance;
              action.instanceAddress = instanceAddress;
              store.dispatch(action);
            }
          }

          if(!instanceAddress) {
            showErr(strings.transactionNoLogsMessage)
          }
        }).catch((error) => {
          showErr(error)
        });
      } else {
        // Try legacy

        state.network.web3.eth.getGasPrice()
        .then((gasPrice) => {
          state.contracts.ethernaut.createLevelInstance(action.level.deployedAddress, {
            gas: 2*estimate.toString(),
            gasPrice: Number(2 * gasPrice),
            from: state.player.address,
            value: deployFunds
          }).then(tx => {
            console.dir(tx)
            instanceAddress = tx.logs[0].args.instance;
  
            instanceAddress = tx.logs.find(l => l.event === 'LevelInstanceCreatedLog').args.instance;
            if(tx.logs.length > 0) {
              action.instanceAddress = instanceAddress
              store.dispatch(action)
            }
  
            else {
              showErr(strings.transactionNoLogsMessage)
            }
          }).catch((error2) => {
            showErr(error2)
          })
        });
      }
        
    });

    return;
  }

  // Get instance from address
  if (!instanceAddress) return;
  console.info(`=> ${strings.instanceAddressMessage}\n${instanceAddress}`);
  const Instance = ethutil.getTruffleContract(
    require(`contracts/build/contracts/levels/${
      action.level.instanceContract
    }/${withoutExtension(action.level.instanceContract)}.json`),
    {
      from: state.player.address,
      gasPrice: 2 * state.network.gasPrice,
    }
  );
  Instance.at(instanceAddress)
    .then((instance) => {
      window.instance = instance.address;
      window.contract = instance;
      action.instance = instance;
      next(action);
    })
    .catch((err) => {
      console.log(`waiting`);
      setTimeout(() => {
        store.dispatch(action);
      }, 1000);
    });
};

export default loadLevelInstance;

// ----------------------------------
// Utils
// ----------------------------------

function withoutExtension(str) {
  return str.split('.')[0];
}
