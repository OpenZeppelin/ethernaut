import * as ethutil from '../utils/ethutil';
import * as actions from '../actions';
import { loadTranslations } from '../utils/translations';

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

 // const estimate = await state.contracts.ethernaut.getLevelInstance.estimateGas(action.level.deployedAddress)
    const estimate = parseInt(action.level.instanceGas, 10) || 2000000;
    const deployFunds = state.network.web3.utils.toWei(
      parseFloat(action.level.deployFunds, 10).toString(),
      'ether'
    );
    let maxPriorityFeePerGas = state.network.web3.utils.toWei('1', 'gwei');
    state.network.web3.eth.getBlock('latest').then((block) => {
      state.contracts.ethernaut
        .createLevelInstance(action.level.deployedAddress, {
          gas: estimate.toString(),
          maxPriorityFeePerGas: maxPriorityFeePerGas,
          maxFeePerGas:
            2 * Number(block.baseFeePerGas) + Number(maxPriorityFeePerGas),
          from: state.player.address,
          value: deployFunds,
        })
        .then((tx) => {
          console.dir(tx);

          instanceAddress = state.network.web3.eth.abi
            .decodeParameter('address', tx.receipt.rawLogs[0].data)
            .toString();

          if (tx.receipt.rawLogs.length > 0) {
            action.instanceAddress = instanceAddress;
            store.dispatch(action);
          } else {
            showErr(strings.transactionNoLogsMessage);
          }
        })
        .catch((error) => {
          showErr(error);
        });
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
      console.log(`${strings.error}: ${err}, ${strings.retrying}`);
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
