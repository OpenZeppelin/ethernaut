import * as ethjs from 'ethereumjs-util';
import TruffleContract from '@truffle/contract';

let web3;
let duplicateTransactions = new Map();

export const setWeb3 = (_web3) => {
  web3 = _web3;
}

export const getTruffleContract = (jsonABI, defaults = {}) => {
  // // HACK: Doing this here instead of `import` so that the project uses the web3.js version
  // // defined in `package.json` instead of relying on Truffle dependencies (that use an old version).
  // // With this, MetaMask v9 deprecation warnings are removed. 
  // const TruffleContract = require('@truffle/contract');
  
  const truffleContract = TruffleContract(jsonABI);
  if(!defaults.gasPrice) defaults.gasPrice = 2000000000;
  if(!defaults.gas) defaults.gas = 2000000;
  truffleContract.defaults(defaults);
  truffleContract.setProvider(web3.currentProvider);
  return truffleContract;
}

export const getBalance = (address) => {
  return new Promise(function(resolve, reject) {
    web3.eth.getBalance(address, function(error, result) {
      if(error) reject(error)
      else resolve(web3.utils.fromWei(result, 'ether'))
    })
  })
}

export const getBlockNumber = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((err, blockNumber) => {
      if(err) reject(err)
      resolve(blockNumber);
    });
  });
}

export const sendTransaction = (options) => {
  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction(options, (err, res) => {
      if(err) reject(err)
      else resolve(res)
    })
  })
}

export const getNetworkId = () => {
  return new Promise((resolve, reject) => {
    web3.eth.net.getId((err, netId) => {
      if(err) reject();
      else resolve(netId);
    });
  });
}

export const toWei = (ether) => {
  return web3.utils.toWei(ether, 'ether')
}

export const fromWei = (wei) => {
  return web3.utils.fromWei(wei, 'ether')
}

export const watchAccountChanges = (callback, lastKnownAccount) => {
  let interval = setInterval(function() {
    web3.eth.getAccounts(function (error, accounts) {
      if(error) return console.log(error)
      const newAccount = accounts[0]
      if(newAccount !== lastKnownAccount) {
        callback(newAccount)
        clearInterval(interval)
        this.watchAccountChanges(callback, newAccount);
      }
    })
  }, 1000)
}

export const watchNetwork = (callbacks) => {

  // Gas price
  if(callbacks.gasPrice) {
    const gasPrice = function() {
      web3.eth.getGasPrice(function(error, result) {
        if(error) return console.log(error)
        callbacks.gasPrice(result)
      })
    }
    gasPrice()
    setInterval(gasPrice, 30 * 60000)
  }

  // Network id
  if(callbacks.networkId) {
    const netId = function() {
      web3.eth.net.getId(function(error, result) {
        if(error) return console.log(error)
        callbacks.networkId(result)
      })
    }
    netId()
    setInterval(netId, 5 * 1000)
  }

  // Block num
  if(callbacks.blockNum) {
    const blockNum = function() {
      web3.eth.getBlockNumber((err, blockNumber) => {
        if(err) console.log(err)
        callbacks.blockNum(blockNumber);
      });
    }
    blockNum()
    setInterval(blockNum, 10 * 1000)
  }

}

export const validateAddress = (address) => {
  if(!address) return false;
  if(address === '0x0000000000000000000000000000000000000000') return false;
  if(address.substring(0, 2) !== "0x") return false;

  // Basic validation: length, valid characters, etc
  if(!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;

  // Checksum validation.
  const raw = address.replace('0x','');
  const allLowerCase = raw.toLowerCase() === raw;
  const allUppercase = raw.toUpperCase() === raw;
  if(allLowerCase || allUppercase) {
    return true; // accepts addreses with no checksum data
  }
  else {
    const checksum = ethjs.toChecksumAddress(address);
    if(address !== checksum) return false;
  }

  return true;
}

export const addressHasChecksum = (address) => {
  if(!module.exports.isValidAddress(address)) return false;
  const raw = address.replace('0x','');
  const allLowerCase = raw.toLowerCase() === raw;
  const allUppercase = raw.toUpperCase() === raw;
  return !(allLowerCase || allUppercase);
}

export const verifySignature = (json) => {
  try {
    const messageHash = ethjs.hashPersonalMessage(ethjs.toBuffer(json.msg));
    const signedMessageDecoded = ethjs.fromRpcSig(json.sig);
    const recoveredPublicKey = ethjs.ecrecover(messageHash, signedMessageDecoded.v, signedMessageDecoded.r, signedMessageDecoded.s);
    const recoveredAddressBuffer = ethjs.pubToAddress(recoveredPublicKey);
    const recoveredAddress = ethjs.bufferToHex(recoveredAddressBuffer);
    return json.address === recoveredAddress;
  }
  catch(err) {
    return false;
  }
}

export const signMessageWithMetamask = (addr, message, callback) => {
  const msg = ethjs.bufferToHex(new Buffer(message, 'utf8'));
  web3.currentProvider.sendAsync({
    method: 'personal_sign',
    params: [msg, addr],
    addr
  }, function(err, res) {
    callback({
      address: addr,
      msg: message,
      sig: res.result,
      version: '2'
    });
  });
}

export const logger = (req, res, next, end) => {
  next((cb) => {
    // HACK: do not log known error when setting event log filters
    if (res.error && !res.error.message.includes("TypeError: Cannot read property 'filter' of undefined")) {
      console.error('Error in RPC response:\n', res.error.message);
    } else if (req.method === 'eth_sendTransaction') {
      console.mineInfo('Sent transaction', res.result);
    } else if (req.method === 'eth_getTransactionReceipt' && res.result) {
      if(duplicateTransactions.size > 1000) duplicateTransactions.clear()
      if(!duplicateTransactions.get(res.result.transactionHash)) {
        duplicateTransactions.set(res.result.transactionHash, true);
        console.mineInfo('Mined transaction', res.result.transactionHash);
      }
    } 
    cb();
  })
}

export const attachLogger = () => {
  if(web3.currentProvider._rpcEngine) {
    web3.currentProvider._rpcEngine._middleware.unshift(logger);
    return;
  }  //If the current provider hasn't an RPC Engine look for other providers
  else if(web3.currentProvider.providers) {
    var providers = web3.currentProvider.providers;
    for(var i = 0; i<providers.length; i++) {
      if(providers[i]._rpcEngine) {
        providers[i]._rpcEngine._middleware.unshift(logger);

        // Set this provider as current provider
        web3.currentProvider = providers[i];
        return;
      }
    }
  }

  //If still there's no RPC Engine throw error
  console.error("Can't find a valid provider, make sure you have Metamask installed and that any other wallet plugin is disabled");
  return;
}
