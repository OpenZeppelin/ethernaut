const Reentrance = artifacts.require('./levels/Reentrance.sol')
const ReentranceFactory = artifacts.require('./levels/ReentranceFactory.sol')
const ReentranceAttack = artifacts.require('./attacks/ReentranceAttack.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')


contract('Reentrance', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await ReentranceFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should allow the player to solve the level', async function() {

    const insertCoin = web3.utils.fromWei(
      (await level.insertCoin.call()).toString(), 'ether'
    )
    console.log(`level insertCoin:`, insertCoin)

    const instance = await utils.createLevelInstance(
      ethernaut, level.address, player, Reentrance,
      {from: player, value: web3.utils.toWei(insertCoin, 'ether')}
    )

    // Query contract balance (should be 0.1)
    let instanceBalance = await utils.getBalance(web3, instance.address)
    console.log(`init instance balance:`, instanceBalance)
    assert.equal(instanceBalance, insertCoin)

    // Deploy attacker contract
    const attackerFunds = 0.01
    const attacker = await ReentranceAttack.new(instance.address, {
      value: web3.utils.toWei(attackerFunds.toString(), 'ether')
    })

    // Check attacker balance
    let attackerBalance = await utils.getBalance(web3, attacker.address)
    console.log(`init attacker balance:`, attackerBalance)
    assert.equal(attackerBalance, attackerFunds)

    // '(◣_◢)'
    await attacker.attack_1_causeOverflow()
    attackerBalance = await utils.getBalance(web3, attacker.address)
    console.log(`post attacker balance 1:`, attackerBalance)
    await attacker.attack_2_deplete()
    attackerBalance = await utils.getBalance(web3, attacker.address)
    console.log(`post attacker balance 2:`, attackerBalance)

    // Query balance
    instanceBalance = await utils.getBalance(web3, instance.address)
    console.log(`post instance balance:`, instanceBalance)
    assert.equal(instanceBalance, 0)

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
