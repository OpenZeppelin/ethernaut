const InstanceFactory = artifacts.require('./levels/InstanceFactory.sol')
const Instance = artifacts.require('./attacks/Instance.sol')
const Ethernaut = artifacts.require('./Ethernaut.sol')

const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')


contract('Instance', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await InstanceFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should allow the player to solve the level', async function() {

    const instance = await utils.createLevelInstance(
      ethernaut, level.address, player, Instance,
      {from: player}
    )

    const password = await instance.password.call()
    await instance.authenticate(password)
    const clear = await instance.getCleared()
    assert.equal(clear, true)

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
