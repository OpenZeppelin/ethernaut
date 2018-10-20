const Denial = artifacts.require('./levels/Denial.sol')
const DenialFactory = artifacts.require('./levels/DenialFactory.sol')
const DenialAttack = artifacts.require('./attacks/DenialAttack.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')

import * as utils from '../utils/TestUtils'
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow'
import toPromise from 'zeppelin-solidity/test/helpers/toPromise'

contract('Denial', function(accounts) {

  let ethernaut
  let level
  let instance
  let player = accounts[0]
  let owner = "0xA9E"
  let initialDeposit = web3.toWei(1,'ether');

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await DenialFactory.new()
    await ethernaut.registerLevel(level.address)
    instance = await utils.createLevelInstance(
      ethernaut, level.address, player, Denial,
      {from: player, value: initialDeposit}
    )
  });

  describe('instance', function() {

    it('should not be immediately solvable', async function() {

      // The owner can withdraw funds
      let owner = await instance.owner();

      // Anyone can call withdraw
      await instance.withdraw();
      // ensure the owner got credited some funds
      assert.isTrue(web3.eth.getBalance(owner) > 0);

      // make sure the factory fails
      const ethCompleted = await utils.submitLevelInstance(
        ethernaut,
        level.address,
        instance.address,
        player
      )
      assert.equal(ethCompleted, false);
    });

    it('it should allow the user to solve the level', async function() {
      // generate the attack contract
      let denialAttack = await DenialAttack.new();
      // set it as the withdraw partner
      await instance.setWithdrawPartner(denialAttack.address);
      // ensure the level is completed
      const ethCompleted = await utils.submitLevelInstance(
        ethernaut,
        level.address,
        instance.address,
        player
      )
      assert.equal(ethCompleted, true);
    });
  });
});
