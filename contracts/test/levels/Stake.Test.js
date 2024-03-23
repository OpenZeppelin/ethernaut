const Stake = artifacts.require('./levels/Stake.sol');
const StakeFactory = artifacts.require('./levels/StakeFactory.sol');
const StakeAttack = artifacts.require('./attacks/StakeAttack.sol');
// const ERC20 = artifacts.require('ERC20');

const Ethernaut = artifacts.require('./Ethernaut.sol');
const {
  BN,
  constants,
  expectEvent,
  expectRevert,
} = require('openzeppelin-test-helpers');
const utils = require('../utils/TestUtils');
const { ethers, upgrades } = require('hardhat');

contract('Stake', function (accounts) {
  let ethernaut;
  let level;
  let owner = accounts[1];
  let player = accounts[0];
  let statproxy;

  before(async function () {
    ethernaut = await utils.getEthernautWithStatsProxy();
    level = await StakeFactory.new();
    await ethernaut.registerLevel(level.address);
  });

  it('should fail if the player did not solve the level', async function () {
    const instance = await utils.createLevelInstance(
      ethernaut,
      level.address,
      player,
      Stake
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
      Stake
    );
    const attacker = await StakeAttack.new();
    await attacker.attack(instance.address, player);

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    );

    assert.isTrue(completed);
  });
});