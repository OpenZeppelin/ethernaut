const Switch = artifacts.require('./levels/Switch.sol')
const SwitchFactory = artifacts.require('./levels/SwitchFactory.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')
const utils = require('../utils/TestUtils')

contract('Switch', function (accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function () {
    ethernaut = await utils.getEthernautWithStatsProxy();
    level = await SwitchFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should fail if the player did not solve the level', async function () {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, Switch)

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )
    

    assert.isFalse(completed)
  });


  it('should allow the player to solve the level', async function () {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, Switch)
    const signature = await web3.eth.sign(web3.utils.keccak256(owner), player)

    await instance.methods["changeOwnership(uint8,bytes32,bytes32)"](
      `0x${signature.slice(130, 132)}`,
      signature.slice(0, 66), 
      `0x${signature.slice(66, 130)}`)

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isTrue(completed)
  });
});
