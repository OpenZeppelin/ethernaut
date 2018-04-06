const PrivacyFactory = artifacts.require('./levels/PrivacyFactory.sol')
const Privacy = artifacts.require('./attacks/Privacy.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')

import * as utils from '../utils/TestUtils'
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow'
import toPromise from 'zeppelin-solidity/test/helpers/toPromise'

contract('Privacy', function(accounts) {

  let ethernaut
  let level
  let instance
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await PrivacyFactory.new()
    await ethernaut.registerLevel(level.address)
    instance = await utils.createLevelInstance(
      ethernaut, level.address, player, Privacy,
      {from: player, value: web3.toWei(1, 'ether')}
    )
  });

  describe('instance', function() {

    it('should start locked', async function() {
      assert.equal(await instance.locked(), true);
    });

    it('should not unlock with any key', async function() {
      await expectThrow(
        instance.unlock("0x123")
      );
    });

    it('should unlock with the proper key', async function() {
      
      // Read storage.
      // for(let i = 0; i < 5; i++) {
        // console.log(web3.eth.getStorageAt(instance.address, i));
      // }

      // Read contract storage.
      const dataEntry = web3.eth.getStorageAt(instance.address, 3);
      const key = '0x' + dataEntry.substring(2, 34);
      // console.log(key);

      // Unlock.
      await instance.unlock(key);
      assert.equal(await instance.locked(), false);

      // Factory check (should pass)
      const completed = await utils.submitLevelInstance(
        ethernaut,
        level.address,
        instance.address,
        player
      );
      assert.equal(completed, true);
    });
  });

});
