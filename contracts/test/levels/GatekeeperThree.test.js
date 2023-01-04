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

  it('should fail if the player didnt solve the level', async function() {
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
    
    await instance.createTrick()
    await attacker.HackFirst()
    const trick = await instance.trick()
    const password = await web3.eth.getStorageAt(trick, 2)
    await attacker.HackTwo(parseInt(password, 16))
    await attacker.HackAll()
    
    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isTrue(completed)
  });

});
