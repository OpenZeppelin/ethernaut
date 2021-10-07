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
    
    // check that PuzzleProxy.pendingAdmin is factory
    assert.equal(owner, await instance.owner())

    // call the PuzzleProxy.proposeNewAdmin(player)
    // need to use artifact from the proxy (not the wallet)

    // check that the player has placed their address in the owner slot
    assert.equal(player, await instance.owner())

    // check that player is not whitelisted yet
    assert.notequal(true, await instance.whitelisted(player))

    // whitelist itself by PuzzleWallet.addToWhitelist(player)
    await instance.addToWhitelist(player, { from: player })

    // deposit 1 eth with PuzzleWallet.deposit{ 1 ether }(1 ether) from player
    await instance.deposit(web3.utils.toWei('1', 'ether'), {from: player, value: web3.utils.toWei('1', 'ether')})

    // build the calldata
    // call PuzzleWallet.multicall(bytes(2x PuzzleWallet.execute.selector(Proxy.address, 1 ether, "")))
    const executeSelector = web3.eth.abi.encodeFunctionSignature("execute(address,uint256,bytes)");
    // call = []

    // call the multicall with the data
    await instance.multicall(calls)

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
