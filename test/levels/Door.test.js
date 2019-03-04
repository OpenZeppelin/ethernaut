const Ethernaut = artifacts.require('./Ethernaut.sol')

const DoorFactory = artifacts.require('./levels/DoorFactory.sol')
const Door = artifacts.require('./levels/Door.sol')

import * as utils from '../utils/TestUtils'
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow'
import toPromise from 'zeppelin-solidity/test/helpers/toPromise'

contract('Door', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await DoorFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should fail if the player did not solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, Door)
    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });

  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, Door)

    // Read contract storage.
    const dataEntry = web3.eth.getStorageAt(instance.address, 0);

    // bytes4(sha3("unlock()")
    const unlock = "0xa69df4b5";

    // unlock
    instance.backDoor(instance.address, unlock, dataEntry);

    const ethCompleted = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isTrue(ethCompleted)
  });

  });
