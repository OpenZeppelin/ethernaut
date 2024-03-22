import * as ethutil from '../utils/ethutil';
import * as actions from '../actions';
import { loadTranslations } from '../utils/translations';
import { getGasFeeDetails } from '../utils/ethutil'
import { verifyContract } from '../utils/contractutil';

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
    getGasFeeDetails(state.network, 2).then(gasFeeDetails => {
      state.contracts.ethernaut
        .createLevelInstance(action.level.deployedAddress, {
          // 2.5 * estimate is required for level creation to succeed in arbitrum goerli
          gas: 2.5 * estimate.toString(),
          ...gasFeeDetails,
          from: state.player.address,
          value: deployFunds,
        })
        .then((tx) => {
          for (var i = 0; i < tx.logs.length; i++) {
            if (tx.logs[i].event === "LevelInstanceCreatedLog") {
              instanceAddress = tx.logs[i].args.instance;
              action.instanceAddress = instanceAddress;
              store.dispatch(action);
            }
          }
          if (!instanceAddress) {
            showErr(strings.transactionNoLogsMessage)
          } else {
            // Wait for the contract to index in the explorer
            setTimeout(() => {
              verifyContract(instanceAddress, action.level, state.network.networkId);
            }, 30000);
          }
        }).catch((error) => {
          showErr(error)
        });
    })
  }

  // Get instance from address
  if (!instanceAddress) return;
  console.info(`=> ${strings.instanceAddressMessage}\n${instanceAddress}`);
  const Instance = ethutil.getTruffleContract(
    require(`../contracts/out/${action.level.instanceContract
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
