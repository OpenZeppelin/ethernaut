const PriceIt = artifacts.require('./levels/PriceIt.sol');
const PriceItFactory = artifacts.require('./levels/PriceItFactory.sol');
const Ethernaut = artifacts.require('./Ethernaut.sol');
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers');
const utils = require('../utils/TestUtils');

contract('PriceIt', function (accounts) {
  let ethernaut;
  let level;
  let owner = accounts[1];
  let player = accounts[0];

  before(async function () {
    ethernaut = await Ethernaut.new();
    level = await PriceItFactory.new();
    await ethernaut.registerLevel(level.address);
  });

  it('should fail if the player did not solve the level', async function () {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, PriceIt);
    const completed = await utils.submitLevelInstance(ethernaut, level.address, instance.address, player);
    assert.isFalse(completed);
  });

  it("should fail if the paired didn't got created", async function () {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, PriceIt);
    const [token0, token1, token2] = await Promise.all([instance.token0(), instance.token1(), instance.token2()]);
    const uniFactoryAddress = 
  });

  // it('should allow the player to solve the level', async function () {
  //   const instance = await utils.createLevelInstance(ethernaut, level.address, player, PriceIt);

  //   const address = await web3.eth.getStorageAt(instance.address, '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc');
  //   let string = '0x' + JSON.stringify(address).substr(27, 40);
  //   string = web3.utils.toChecksumAddress(string);

  //   const attacker = await MotorbikeAttack.new(string);

  //   // ATTACK FIRST STEP: Take control over upgradeability functionality
  //   await attacker.takeControl();

  //   // ATTACK SECOND STEP: Destroy the implementation
  //   await attacker.destroy();

  //   const completed = await utils.submitLevelInstance(ethernaut, level.address, instance.address, player);

  //   assert.isTrue(completed);
  // });
});
