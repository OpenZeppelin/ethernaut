/*eslint no-undef: "off"*/
const utils = require('../utils/TestUtils');


const ReentranceHouse = artifacts.require('./levels/ReentranceHouse.sol');
const ReentranceHouseFactory = artifacts.require('./levels/ReentranceHouseFactory.sol');
const ReentranceHouseAttack = artifacts.require('./attacks/ReentranceHouseAttack.sol');
const Pool = artifacts.require('Pool');
const PoolToken = artifacts.require('PoolToken');

contract('ReentranceHouse', function (accounts) {
  let ethernaut;
  let level;
  let instance;
  let player = accounts[0];

  let pool;
  let poolDepositToken;


  before(async function () {
    ethernaut = await utils.getEthernautWithStatsProxy();
    level = await ReentranceHouseFactory.new();
    await ethernaut.registerLevel(level.address);
    instance = await utils.createLevelInstance(
      ethernaut,
      level.address,
      player,
      ReentranceHouse,
      { from: player }
    );

    pool = await Pool.at(await getAddressFromStorage(instance.address, 0));
    poolDepositToken = await PoolToken.at(await getAddressFromStorage(pool.address, 2));
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

    it('should not be bettor', async function () {
      // turnSwitchOn() should revert on standard call from player
     const isBettor = await instance.isBettor(player);
     assert.equal(isBettor, false);
    });

    it('should allow the player to solve the level', async function() {  
      const attackerFunds = 0.01;
      const attacker = await ReentranceHouseAttack.new(instance.address, {
        value: web3.utils.toWei(attackerFunds.toString(), 'ether'),
      });

      await poolDepositToken.transfer(attacker.address, 5, {from: player});
      await attacker.setNeededParameters(pool.address, poolDepositToken.address);
      await attacker.attack()
      const completed = await utils.submitLevelInstance(
        ethernaut,
        level.address,
        instance.address,
        player
      )
  
      assert.isTrue(completed)
    });
  
  });
});


// A function to get address from storage.
let getAddressFromStorage = async function (instanceAddress, slot) {
  let slotValue = await web3.eth.getStorageAt(instanceAddress, slot);
  return '0x' + slotValue.slice(26);
};
