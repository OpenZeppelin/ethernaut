const DoubleEntryPoint = artifacts.require('./levels/DoubleEntryPoint.sol')
const DoubleEntryPointFactory = artifacts.require('./levels/DoubleEntryPointFactory.sol')
const DoubleEntryPointAttack = artifacts.require('./attacks/DoubleEntryPointAttack.sol')
const TransparentUpgradeableProxy = artifacts.require('@openzeppelin/contracts/proxy/TransparentUpgradeableProxy.sol')
const CryptoVault = artifacts.require('./levels/CryptoVault.sol')
const Agent = artifacts.require('contracts/levels/DoubleEntryPoint.sol:Agent')


const Ethernaut = artifacts.require('./Ethernaut.sol')
const { web3 } = require('openzeppelin-test-helpers/src/setup')
const utils = require('../utils/TestUtils')


contract('DoubleEntryPoint', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await DoubleEntryPointFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should fail if the player did not solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, DoubleEntryPoint)

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });


  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, DoubleEntryPoint);
    
    const attacker = await DoubleEntryPointAttack.new();

    const proxyContract = await TransparentUpgradeableProxy.at(instance.address)

    const VaultContract = await CryptoVault.at(
      await instance.cryptoVault({from: owner})
    )

    await proxyContract.upgradeTo(attacker.address, {from: player});
    
    await VaultContract.sweepToken(
      await instance.delegatedFrom({from: owner})
    );

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isTrue(completed)
  });

});
