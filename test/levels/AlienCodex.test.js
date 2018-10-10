const AlienCodex = artifacts.require('./levels/AlienCodex.sol')
const AlienCodexFactory = artifacts.require('./levels/AlienCodexFactory.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')

import * as utils from '../utils/TestUtils'
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow'
import toPromise from 'zeppelin-solidity/test/helpers/toPromise'

contract('AlienCodex', function(accounts) {

  let ethernaut
  let level
  let instance
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await AlienCodexFactory.new()
    await ethernaut.registerLevel(level.address)
    instance = await utils.createLevelInstance(
      ethernaut, level.address, player, AlienCodex,
      {from: player}
    )
  });

  describe('instance', function() {

    it('should allow the user to join AlienCodex, with arbitrary length', async function() {
      assert.notEqual(player, owner);
      let status = await instance.contact.call();
      assert.isFalse(status);

      let _data = '0x1d3d4c0b0000000000000000000000000000000000000000000000000000000000000020F0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000005';
      await toPromise(web3.eth.sendTransaction)({
        from: player,
        to: instance.address,
        data: _data
      })
      
      // await instance.join_AlienCodex();
      status = await instance.contact.call();
      assert.isTrue(status);
    });

    it('should underflow and give user all storage access', async function() {

    });

    it('should allow the player to become owner', async function() {
      //TODO
      //     // Player should own the instance now
      // owner = await instance.owner.call()
      // console.log(`new instance owner:`, owner)
      // assert.equal(owner, player)

      // // Factory check
      // const ethCompleted = await utils.submitLevelInstance(
      //   ethernaut,
      //   level.address,
      //   instance.address,
      //   player
      // )
      // assert.equal(ethCompleted, true)
    });
  });
});