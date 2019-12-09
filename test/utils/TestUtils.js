export function getBalance(web3, address) {
  return new Promise(function(resolve, reject) {
    web3.eth.getBalance(address, function(error, result) {
      if(error) reject(error)
      else resolve(web3.utils.fromWei(result.toString(), 'ether'))
    })
  })
}

export function skipBlocks(numBlocks, web3) {
  return new Promise(async resolve => {
    for(let i = 0; i < numBlocks; i++) {
      await skipBlock(web3);
    }
    resolve();
  });
}

export function skipBlock(web3) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_mine'
    }, (error, result) => {
      if(error) reject();
      else resolve(result);
    });
  });
}

export async function createLevelInstance(ethernaut, levelAddress, player, levelInstanceClass, params) {
  return new Promise(async function(resolve, reject) {
    const data = params || {from: player}
    const tx = await ethernaut.createLevelInstance(levelAddress, data);
    if(tx.logs.length === 0) reject()
    else {
      const events = tx.logs.filter(e => e.event === "LevelInstanceCreatedLog");
      const instanceAddress = events[0].args.instance;
      const instance = await levelInstanceClass.at(instanceAddress);
      resolve(instance);
    }
  });
}

export async function submitLevelInstance(ethernaut, levelAddress, instanceAddress, player, params) {
  return new Promise(async function(resolve) {
    const data = params || {from: player}
    const tx = await ethernaut.submitLevelInstance(instanceAddress, data);
    if(tx.logs.length === 0) resolve(false)
    else {
      const events = tx.logs.filter(e => e.event === "LevelCompletedLog");
      const ethLevelAddress = events[0].args.level;
      const ethPlayer = events[0].args.player;
      if(player === ethPlayer && levelAddress === ethLevelAddress) {
        resolve(true)
      }
      else resolve(false)
    }
  });
}

