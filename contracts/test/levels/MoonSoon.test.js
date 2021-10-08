const Ethernaut = artifacts.require('./Ethernaut.sol')

const MoonSoonFactory = artifacts.require('./levels/MoonSoonFactory.sol')
const MoonSoon = artifacts.require('./levels/MoonSoon.sol')
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')


contract('MoonSoon', function(accounts) {

  let ethernaut
  let level
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await MoonSoonFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should fail if the player didnt solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, MoonSoon)
    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });

  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, MoonSoon)

    await instance.approve('0x0000000000000000000000000000000000000000', 0);
    await instance.approve('0x0000000000000000000000000000000000000000', 100);

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isTrue(completed)
  });

});
