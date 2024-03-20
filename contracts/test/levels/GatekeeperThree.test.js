const GatekeeperThreeFactory = artifacts.require('./levels/GatekeeperThreeFactory.sol')
const GatekeeperThree = artifacts.require('./levels/GatekeeperThree.sol')
const GatekeeperThreeAttack = artifacts.require('./attacks/GatekeeperThreeAttack.sol')

const utils = require('../utils/TestUtils');

contract('GatekeeperThree', function(accounts) {

  let ethernaut
  let level
  let player = accounts[0]

  before(async function() {
    ethernaut = await utils.getEthernautWithStatsProxy();
    level = await GatekeeperThreeFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it("should fail if the player didn't solve the level", async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, GatekeeperThree)
    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });

  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, GatekeeperThree)

    const attacker = await GatekeeperThreeAttack.new(instance.address, {
      from: player, value:120000000000000000
    })
    
    await attacker.attack()
    
    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isTrue(completed)
  });

});
