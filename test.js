const Web3 = require('web3');

async function testConnection(providerUrl) {
    try {
        const web3 = new Web3(providerUrl);
        const blockNumber = await web3.eth.getBlockNumber();
        console.log(`Connected to ${providerUrl}! Latest block:`, blockNumber);
        return true;
    } catch (error) {
        console.error(`Connection failed to ${providerUrl}:`, error.message);
        return false;
    }
}

async function connectWithRetry() {
    const primaryUrl = 'http://localhost:8545';
    const secondaryUrl = 'http://127.0.0.1:8545';

    const primaryConnection = await testConnection(primaryUrl);
    
    if (!primaryConnection) {
        console.log('Attempting to connect to secondary URL...');
        console.log('There maybe an error on how your localhost is configured');
        await testConnection(secondaryUrl);
    }
}

connectWithRetry();