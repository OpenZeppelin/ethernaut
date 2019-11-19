const KingFactory = artifacts.require('./levels/KingFactory.sol')
const King = artifacts.require('./attacks/King.sol')
const KingAttack = artifacts.require('./attacks/KingAttack.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
import * as utils from '../utils/TestUtils'


contract('King', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await KingFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should allow the player to solve the level', async function() {

    const instance = await utils.createLevelInstance(
      ethernaut, level.address, player, King,
      {from: player, value: web3.utils.toWei('1', 'ether')}
    )

    // Init checks
    assert.equal(await instance._king(), level.address)
    assert.equal(web3.utils.fromWei(await instance.prize()).toString(), '1')
    console.log('king:', await instance._king())
    console.log('prize:', web3.utils.fromWei(await instance.prize()).toString())

    // Ensure that players can become king
    console.log('new king...')
    await (web3.eth.sendTransaction)({
      from: accounts[1],
      to: instance.address,
      value: web3.utils.toWei('2', 'ether')
    })
    console.log('king:', await instance._king());
    console.log('prize:', web3.utils.fromWei(await instance.prize()).toString())
    assert.equal(web3.utils.fromWei(await instance.prize()).toString(), '2')
    assert.equal(await instance._king(), accounts[1])

    // Ensure that players dont become king if they dont meet the prize
    console.log('failed claim...')
    await expectRevert.unspecified(
      (web3.eth.sendTransaction)({
        from: accounts[2],
        to: instance.address,
        value: web3.utils.toWei('0.1', 'ether')
      })
    )
    console.log('king:', await instance._king());
    console.log('prize:', web3.utils.fromWei(await instance.prize()).toString())
    assert.equal(web3.utils.fromWei(await instance.prize()).toString(), '2')
    assert.equal(await instance._king(), accounts[1])

    // Factory check (should fail)
    // NOTE: Factory check makes the level become the king,
    //       player wins when the factory is not able to do this.
    console.log('Check complete (should fail)...')
    let completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )
    console.log('completed:', completed)
    assert.equal(completed, false)
    assert.equal(await instance._king(), level.address)

    // Attack
    const attackerFunds = '2.01'
    const attacker = await KingAttack.new();
    await attacker.doYourThing(instance.address, {
      value: web3.utils.toWei(attackerFunds, 'ether')
    })

    // Factory check (should pass)
    console.log('Check complete (should pass)...')
    completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )
    console.log('completed:', completed)
    assert.equal(completed, true)

  });

});
