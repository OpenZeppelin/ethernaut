const VaultFactory = artifacts.require('./levels/VaultFactory.sol');
const Vault = artifacts.require('./attacks/Vault.sol');
const VaultAttack = artifacts.require('./attacks/VaultAttack.sol');

const Ethernaut = artifacts.require('./Ethernaut.sol');
const {
  BN,
  constants,
  expectEvent,
  expectRevert,
} = require('openzeppelin-test-helpers');
const utils = require('../utils/TestUtils');
const { ethers, upgrades } = require('hardhat');

contract('Vault', function (accounts) {
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
    level = await VaultFactory.new();
    await ethernaut.registerLevel(level.address);
  });

  it('should fail if the player did not solve the level', async function () {
    const instance = await utils.createLevelInstance(
      ethernaut,
      level.address,
      player,
      Vault
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
      Vault
    );

    const attacker = await VaultAttack.new();
    var hexStr = web3.utils.utf8ToHex(
      await web3.eth.getStorageAt(instance.address, 1)
    );
    var password = web3.utils.hexToAscii(hexStr);

    await attacker.attack(instance.address, password);

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    );

    assert.isTrue(completed);
  });
});
