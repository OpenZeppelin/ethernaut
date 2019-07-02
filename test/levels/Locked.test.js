const LockedFactory = artifacts.require('./levels/LockedFactory.sol')
const Locked = artifacts.require('./levels/Locked.sol')
const Ethernaut = artifacts.require('./Ethernaut.sol')

const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
import * as utils from '../utils/TestUtils'


contract('Locked', function(accounts) {

  let ethernaut
  let level
  let instance
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await LockedFactory.new()
    await ethernaut.registerLevel(level.address)
    instance = await utils.createLevelInstance(
      ethernaut, level.address, player, Locked,
      {from: player}
    )
  });

  describe('instance', function() {

    it('should start locked', async function() {
      assert.equal(await instance.unlocked(), false);
    });

    it('should not unlock with any name', async function() {
      await expectRevert.unspecified(
        instance.register("0x123", "0x1230000000000000000000000000000000000000") 
      );
    });

    it('should unlock with a non-zero first byte', async function() {
      let _name = "0x0000000000000000000000000000000000000000000000000000000000000001"
      let _address = "0x1230000000000000000000000000000000000000"

      // Unlock.
      await instance.register(_name, _address);
      assert.equal(await instance.unlocked(), true);

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
