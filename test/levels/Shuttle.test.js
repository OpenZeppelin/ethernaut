const ShuttleFactory = artifacts.require('./levels/ShuttleFactory.sol')
const Shuttle = artifacts.require('./attacks/Shuttle.sol')
const ShuttleAttack = artifacts.require('./attacks/ShuttleAttack.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')

import * as utils from '../utils/TestUtils'
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow'
import toPromise from 'zeppelin-solidity/test/helpers/toPromise'

contract('Shuttle', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await ShuttleFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should fail if the player did not solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, Shuttle)

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });


  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, Shuttle)

    const attacker = await ShuttleAttack.new()
    var password = web3.toAscii(web3.eth.getStorageAt(instance.address, 1));

    await attacker.attack(instance.address, password)

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isTrue(completed)
  });

});
