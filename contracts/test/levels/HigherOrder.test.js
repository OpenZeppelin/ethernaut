const HigherOrderFactory = artifacts.require('./levels/HigherOrderFactory.sol');
const HigherOrderAttack = artifacts.require('./attacks/HigherOrderAttack.sol');
const HigherOrder = artifacts.require('./levels/HigherOrder.sol');

const utils = require('../utils/TestUtils');

contract('HigherOrder', function (accounts) {
  let ethernaut;
  let level;
  let player = accounts[0];

  before(async function () {
    ethernaut = await utils.getEthernautWithStatsProxy();
    level = await HigherOrderFactory.new();
    await ethernaut.registerLevel(level.address);
  });

  it('should fail if the player didnt solve the level', async function () {
    const instance = await utils.createLevelInstance(
      ethernaut,
      level.address,
      player,
      HigherOrder
    );
    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    );

    assert.isFalse(completed);
  });

  it('should allow the player to solve the level', async function () {
    const instance = await utils.createLevelInstance(
      ethernaut,
      level.address,
      player,
      HigherOrder
    );

    const attacker = await HigherOrderAttack.new();
    await attacker.attack(instance.address);
    await instance.claimLeadership();

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    );

    assert.isTrue(completed);
  });
});
