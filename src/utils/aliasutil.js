let aliasContract;
let web3;
export function set(_web3, _aliasContract) {
  web3 = _web3;
  aliasContract = _aliasContract;
}

// remove null bytes, return address if no alias is set
export function getAliasForPlayer(playerAddress) {
    return new Promise(async (resolve) => {
        const alias = web3.toAscii(await aliasContract.aliasOf(playerAddress)).replace(/\u0000/g, '');
        return resolve(alias.length > 0 ? alias : playerAddress);
    });
}

// use this method in the ui to reject bad data before sending it to the contract
export function setAliasWithChecks(alias, params = {}) {
    return new Promise(async (resolve, reject) => {
        if (alias.length < 1 || alias.length > 32) return reject('alias must be between 1 and 32 characters');
        if (alias[0] == ' ' ||  alias[alias.length - 1] == ' ') return reject('alias cannot start or end with space');
        if (alias.startsWith('0x')) return reject('alias cannot start with 0x');
        if (alias.match(/[  ]/g)) return reject('alias cannot contain consecutive spaces');
        if (!alias.match(/[a-zA-Z0-9 ]/g)) return reject('alias contains invalid characters. only a-z, 0-9 and single space are valid');
        if (!alias.match(/[a-zA-Z0]+/g)) return reject('alias cannot be only numbers');

        // check if alias exists before we send a transaction
        const isValidAlias = await aliasContract.isValidAlias(alias);
        if (isValidAlias == false) return reject('alias is already in use');

        const results = await setAlias(alias, params);
        
        if (results === true) return resolve(true);
        return reject(results);
    });
}

// use this method to test set alias if the user were to bypasses the ui to interact with the contract
export function setAlias(alias, params = {}) {
    return new Promise(async (resolve, reject) => { 
        if (!params.gas) params.gas = 450000;
        if (!params.from) params.from = web3.eth.accounts[0];

        await aliasContract.setAlias(alias, params)
        .catch(function(error) {
            return reject(error);
        });

        return resolve(true);
    });
}