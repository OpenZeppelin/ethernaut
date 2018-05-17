const GateKeeperOneFactory = artifacts.require('./levels/GatekeeperOneFactory.sol')
const GateKeeperTwoFactory = artifacts.require('./levels/GatekeeperTwoFactory.sol')
const GatekeeperOne = artifacts.require('./attacks/GatekeeperOne.sol')
const GatekeeperTwo = artifacts.require('./attacks/GatekeeperTwo.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')

import * as utils from '../utils/TestUtils'
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow'
import toPromise from 'zeppelin-solidity/test/helpers/toPromise'

contract('Gatekeeper', function(accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    // level = await InstanceFactory.new()
    // await ethernaut.registerLevel(level.address)
  });

  it.skip('should allow the player to solve the level', async function() {

    // TODO: These levels are from theCyber, another game that is currently not publishing it's solutions.
    // For the time being, no tests/solutions will be posted until theCyber's solutions are made public.
  });

});
