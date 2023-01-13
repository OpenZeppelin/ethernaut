/*eslint no-undef: "off"*/
const Switch = artifacts.require('./levels/Switch2.sol');
const SwitchFactory = artifacts.require('./levels/SwitchFactory2.sol');
const SwitchAttack = artifacts.require('./attacks/SwitchAttack2.sol');

const utils = require('../utils/TestUtils');

contract('Switch-2', function (accounts) {
  let ethernaut;
  let level;
  let owner = accounts[1];
  let player = accounts[0];

  before(async function () {
    ethernaut = await utils.getEthernautWithStatsProxy();
    level = await SwitchFactory.new();
    await ethernaut.registerLevel(level.address);
  });

  it('should fail if the player did not solve the level', async function () {
    const instance = await utils.createLevelInstance(
      ethernaut,
      level.address,
      player,
      Switch
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
      Switch
    );

    const attacker = await SwitchAttack.new();
    const signature = await web3.eth.sign(web3.utils.keccak256(owner), player);
    await attacker.attack(
      instance.address,
      player,
      `0x${signature.slice(130, 132)}`,
      signature.slice(0, 66),
      `0x${signature.slice(66, 130)}`
    );

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    );

    assert.isTrue(completed);
  });
});
