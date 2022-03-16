const FortaCounter = artifacts.require('./levels/FortaCounter.sol')
const FortaCounterFactory = artifacts.require('./levels/FortaCounterFactory.sol')
const FortaCounterAttack = artifacts.require('./attacks/FortaCounterAttack.sol')
const Proxy = artifacts.require('./levels/Proxy.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')


contract('FortaCounter', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await FortaCounterFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should fail if the player did not solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, FortaCounter)

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });


  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, FortaCounter);
    
    const attacker = await FortaCounterAttack.new();
    //Save counter value on proxy storage
    const valueBefore = await instance.counter();
    console.log(valueBefore);

    //Call the proxy at _delegate with attacker.address and data the encoding of `changeValue`
    const proxyContract = await Proxy.at(level.address);

    await proxyContract._delegate(attacker.address, {data: '0x0'})

    //Check that counter value on proxy storage changes by -1
    const valueAfter = await instance.counter();
    console.log(valueAfter);


    // const completed = await utils.submitLevelInstance(
    //   ethernaut,
    //   level.address,
    //   instance.address,
    //   player
    // )
    
    // assert.isTrue(completed)
  });

});
