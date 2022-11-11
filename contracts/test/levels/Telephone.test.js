const Telephone = artifacts.require('./levels/Telephone.sol');
const TelephoneFactory = artifacts.require('./levels/TelephoneFactory.sol');
const TelephoneAttack = artifacts.require('./attacks/TelephoneAttack.sol');

const Ethernaut = artifacts.require('./Ethernaut.sol');
const {
  BN,
  constants,
  expectEvent,
  expectRevert,
} = require('openzeppelin-test-helpers');
const utils = require('../utils/TestUtils');
const { ethers, upgrades } = require('hardhat');

contract('Telephone', function (accounts) {
  let ethernaut;
  let level;
  let owner = accounts[1];
  let player = accounts[0];
  let statproxy;

  before(async function () {
    ethernaut = await Ethernaut.new();
    const ProxyStat = await ethers.getContractFactory('Statistics');
    statproxy = await upgrades.deployProxy(ProxyStat, [ethernaut.address]);
    await ethernaut.setStatistics(statproxy.address);
    level = await TelephoneFactory.new();
    await ethernaut.registerLevel(level.address);
  });

  it('should fail if the player did not solve the level', async function () {
    const instance = await utils.createLevelInstance(
      ethernaut,
      level.address,
      player,
      Telephone
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
      Telephone
    );

    const attacker = await TelephoneAttack.new();
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
