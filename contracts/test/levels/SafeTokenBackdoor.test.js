const SafeTokenBackdoor = artifacts.require('./levels/SafeTokenBackdoor.sol')
const SafeTokenFactory = artifacts.require('./levels/SafeTokenFactory.sol')
const SafeTokenAttack = artifacts.require('./levels/SafeTokenAttack.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')


contract('SafeTokenBackdoor', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await SafeTokenFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should fail if the player did not solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, SafeTokenBackdoor)

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });
  

  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, SafeTokenBackdoor);
    const attacker = await SafeTokenAttack.new();
    
    let instanceowner = await instance.owner();
    const ownerBalanceBefore = await instance.balanceOf(instanceowner);
    console.log("owner balance before attack: " + ownerBalanceBefore);
    
    //call the injected function with the password directly to activate the backdoor
    await attacker.openBackdoor(instance.address);

    //call the backdoored transfer function to get the owners tokens
    await attacker.transferOwnerTokens(instance.address);
   
    const ownerBalanceAfter = await instance.balanceOf(instanceowner);
    console.log("owner balance after attack: " + ownerBalanceAfter);


    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )
    
    assert.isTrue(completed)
  });

});
