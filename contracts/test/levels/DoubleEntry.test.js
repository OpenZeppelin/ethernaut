const DoubleEntry = artifacts.require('./levels/DoubleEntry.sol')
const DoubleEntryFactory = artifacts.require('./levels/DoubleEntryFactory.sol')
const DoubleEntryAttack = artifacts.require('./attacks/DoubleEntryAttack.sol')
const TransparentUpgradeableProxy = artifacts.require('@openzeppelin/contracts/proxy/TransparentUpgradeableProxy.sol')
const DEX = artifacts.require('./levels/DEX.sol')


const Ethernaut = artifacts.require('./Ethernaut.sol')
const { web3 } = require('openzeppelin-test-helpers/src/setup')
const utils = require('../utils/TestUtils')


contract('DoubleEntry', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await DoubleEntryFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should fail if the player did not solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, DoubleEntry)

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });


  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, DoubleEntry);
    
    const attacker = await DoubleEntryAttack.new();

    const proxyContract = await TransparentUpgradeableProxy.at(instance.address)

    const DexContract = await DEX.at(
      await instance.dex({from: owner})
    )

    await proxyContract.upgradeTo(attacker.address, {from: player});
    
    await DexContract.sweepToken(
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
