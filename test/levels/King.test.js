const KingFactory = artifacts.require('./levels/KingFactory.sol')
const King = artifacts.require('./attacks/King.sol')
const KingAttack = artifacts.require('./attacks/KingAttack.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')

import * as utils from '../utils/TestUtils'
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow'
import toPromise from 'zeppelin-solidity/test/helpers/toPromise'

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
      {from: player, value: web3.toWei(1, 'ether')}
    )

    // Init checks
    assert.equal(await instance.king(), level.address)
    assert.equal(web3.fromWei(await instance.prize()).toNumber(), 1)
    console.log('king:', await instance.king())
    console.log('prize:', web3.fromWei(await instance.prize()).toNumber())

    // Ensure that players can become king
    console.log('new king...')
    await toPromise(web3.eth.sendTransaction)({
      from: accounts[1],
      to: instance.address,
      value: web3.toWei(2, 'ether')
    })
    console.log('king:', await instance.king());
    console.log('prize:', web3.fromWei(await instance.prize()).toNumber())
    assert.equal(web3.fromWei(await instance.prize()).toNumber(), 2)
    assert.equal(await instance.king(), accounts[1])

    // Ensure that players dont become king if they dont meet the prize
    console.log('failed claim...')
    await expectThrow(
      toPromise(web3.eth.sendTransaction)({
        from: accounts[2],
        to: instance.address,
        value: web3.toWei(0.1, 'ether')
      })
    )
    console.log('king:', await instance.king());
    console.log('prize:', web3.fromWei(await instance.prize()).toNumber())
    assert.equal(web3.fromWei(await instance.prize()).toNumber(), 2)
    assert.equal(await instance.king(), accounts[1])

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

    // Attack
    const attackerFunds = 2.01
    const attacker = await KingAttack.new();
    await attacker.doYourThing(instance.address, {
      value: web3.toWei(attackerFunds, 'ether')
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
