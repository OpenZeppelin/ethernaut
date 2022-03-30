const DoubleEntryPoint = artifacts.require('./levels/DoubleEntryPoint.sol')
const DoubleEntryPointFactory = artifacts.require('./levels/DoubleEntryPointFactory.sol')
const Agent = artifacts.require('./attacks/Agent.sol')
const Forta = artifacts.require('./levels/Forta.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')
const { web3 } = require('openzeppelin-test-helpers/src/setup')
const utils = require('../utils/TestUtils')


contract('DoubleEntryPoint', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await DoubleEntryPointFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should fail if the player did not solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, DoubleEntryPoint)

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });


  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, DoubleEntryPoint);

    const fortaAddress = await instance.forta();
    
    const fortaContract = await Forta.at(fortaAddress);
    
    const agent = await Agent.new(fortaAddress, {from: player});

    await fortaContract.setAgent(agent.address, {from: player});

    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isTrue(completed)
  });

});
