const CoinFlipFactory = artifacts.require('./levels/CoinFlipFactory.sol')
const CoinFlip = artifacts.require('./levels/CoinFlip.sol')
const CoinFlipAttack = artifacts.require('./attacks/CoinFlipAttack.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')

import * as utils from '../utils/TestUtils'
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow'
import toPromise from 'zeppelin-solidity/test/helpers/toPromise'

contract('CoinFlip', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await CoinFlipFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should fail if the player did not solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, CoinFlip)

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });

  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, CoinFlip)
    const attacker = await CoinFlipAttack.new()
    
    // To weaponize this attack you'd need to pole for a new block to be mined, as the contract only allows one flip per block. testrpc automatically mines blocks when transactions are sent, so no need to account for it here.

    for (var i = 0; i < 10; i++) {
      await attacker.attack(instance.address)
    }

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isTrue(completed)
  });

});
