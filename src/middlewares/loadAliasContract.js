import * as ethutil from '../utils/ethutil';
import * as actions from '../actions';
import AliasABI from '../../build/contracts/Alias.json';
import * as aliasutil from '../utils/aliasutil';

export default store => next => action => {
  if(action.type !== actions.LOAD_ALIAS_CONTRACT) return next(action);
  if(action.alias !== undefined) return next(action);

  const state = store.getState();

  if(!state.network.web3 || !state.player.address || !state.gamedata.aliasAddress) return next(action);
  
  // Get contract template
  const Alias = ethutil.getTruffleContract(AliasABI, { from: state.player.address, gasPrice: state.network.gasPrice });

  // Get deployed instance
  Alias.at(state.gamedata.aliasAddress)
    .then(instance => {
      // for player interaction via the browser's console
      aliasutil.set(state.network.web3, instance);
      action.alias = instance;
      next(action);
    })
    .catch(() => {
      console.error(`@bad Alias contract not found in the current network. Please make sure (1) that you are using metamask, (2) that it's on the ropsten testnet, (3) that it is unlocked, and (4) then refresh.`)
    });
}
