const Bulletin = artifacts.require('./levels/Bulletin.sol')
const BulletinFactory = artifacts.require('./levels/BulletinFactory.sol')
const BulletinAttack = artifacts.require('./attacks/BulletinAttack.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')

import * as utils from '../utils/TestUtils'
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow'
import toPromise from 'zeppelin-solidity/test/helpers/toPromise'

contract('Bulletin', function(accounts) {
  
  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await BulletinFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should fail if the player did not solve the level', async function() {
    // TODO
  });


  it('should allow the player to solve the level', async function() {
    //TODO
  });

});