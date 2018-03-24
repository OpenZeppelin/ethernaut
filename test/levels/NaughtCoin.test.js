const NaughtCoin = artifacts.require('./levels/NaughtCoin.sol')
const NaughtCoinFactory = artifacts.require('./levels/NaughtCoinFactory.sol')
const NaughtCoinAttack = artifacts.require('./attacks/NaughtCoinAttack.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')

import * as utils from '../utils/TestUtils'
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow'
import toPromise from 'zeppelin-solidity/test/helpers/toPromise'

contract('NaughtCoin', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await NaughtCoinFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should fail if the player did not solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, NaughtCoin)

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });


  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, NaughtCoin);
    const attacker = await NaughtCoinAttack.new();

    // Allow the contract to call transferFrom on your behalf
    let balance = await instance.balanceOf(player); 
    await instance.approve(attacker.address, balance);

    // Transfer the tokens out
    await attacker.attack(instance.address, player);

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )
    
    assert.isTrue(completed)
  });

});
