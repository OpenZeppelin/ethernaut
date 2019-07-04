const RecoveryFactory = artifacts.require('./levels/RecoveryFactory.sol')
const Recovery = artifacts.require('./levels/Recovery.sol')
const RecoverySimpleToken = artifacts.require('./levels/RecoverySimpleToken.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')
import * as utils from '../utils/TestUtils'

let rlp = require('rlp')
let sha3 = require('sha3')

// A function to calculate generated addresses.
let targetAddress = function(instanceAddress,nonce) {
    let bufferAddress = Buffer.from(instanceAddress.slice(2),'hex');
    let data = rlp.encode([bufferAddress,nonce])
    let d = new sha3.SHA3Hash(256);
    d.update(data);
    return '0x' + d.digest('hex').slice(24);
}

contract('Recovery', function(accounts) {

  let level
  let ethernaut
  let player = accounts[0]
  let instance

  before(async function () {
    ethernaut = await Ethernaut.new();
    level = await RecoveryFactory.new()
    await ethernaut.registerLevel(level.address)

    console.log("here");
    console.log(level.address);

    instance = await utils.createLevelInstance(
      ethernaut, level.address, player, Recovery,
      {from: player, value: web3.utils.toWei('1', 'ether')}
    )
  })

  it('should be deployed as expected', async function() {
    // Init checks
    let generatedTokenAddress = targetAddress(instance.address,1);
    let generatedTokenInstance = await RecoverySimpleToken.at(generatedTokenAddress);
    // Check that is is created as expected
    assert.equal(await generatedTokenInstance.name.call(), "InitialToken");
  })

  it('should allow players to create simple tokens', async function() {
    // Ensure that players can create a token
    console.log('creating a new token...')
    await instance.generateToken("test", 50);
    // Check the created contract address is as expected
    let testTokenAddress = targetAddress(instance.address,2);
    let testInstance = await RecoverySimpleToken.at(testTokenAddress);
    assert.equal(await testInstance.name.call(), "test");
  });

  it('should allow the player to solve the level', async function () {
    console.log('Check complete (should fail)...')
    let completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )
    console.log('completed:', completed)
    assert.equal(completed, false)

    // The solution
    // We find the address and call suicide. 
    console.log('Performing attack');
    let generatedTokenAddress = targetAddress(instance.address,1);
    let generatedTokenInstance = await RecoverySimpleToken.at(generatedTokenAddress);
    console.log('Suiciding all target addresses');
    // Suicide the contract
    await generatedTokenInstance.destroy(player)

    // Factory check (should pass)
    console.log('Check complete (should pass)...')
    completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )
    console.log('completed:', completed)
    assert.equal(completed, true)

  });

});
