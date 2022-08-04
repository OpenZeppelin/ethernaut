const GoodSamaritanFactory = artifacts.require('GoodSamaritanFactory')
const GoodSamaritan = artifacts.require('GoodSamaritan')
const Wallet = artifacts.require('Wallet')
const Coin = artifacts.require('Coin')
const GoodSamaritanAttack = artifacts.require('GoodSamaritanAttack')

const Ethernaut = artifacts.require('./Ethernaut.sol')
const utils = require('../utils/TestUtils')


contract('GoodSamaritan', function(accounts) {

  let ethernaut
  let level
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new()
    level = await GoodSamaritanFactory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should allow the player to solve the level', async function() {

    const instance = await utils.createLevelInstance(
      ethernaut, level.address, player, GoodSamaritan,
      {from: player, value: web3.utils.toWei('0.001', 'ether')}
    )

    let coin = await Coin.at(await instance.coin())
    let wallet = await Wallet.at(await instance.wallet())
    let attacker = await GoodSamaritanAttack.new(instance.address)

    // Init checks
    assert.equal(await wallet.coin(), coin.address)
    assert.equal(await coin.balances(wallet.address), 10**6)
    assert.equal(await coin.balances(player), 0)

    // Ensure that players can requestDonation
    await instance.requestDonation({from: player});

    assert.equal((await coin.balances(wallet.address)).toNumber(), 10**6 - 10)
    assert.equal(await coin.balances(player), 10)

    // Factory check (should fail)
    let completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.equal(completed, false)

    // Ensure that players can hack the contract
    await attacker.attack();

    assert.equal((await coin.balances(wallet.address)).toNumber(), 0)
    assert.equal(await coin.balances(attacker.address), 10**6 - 10)

    // Factory check (should pass)
    completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.equal(completed, true)
  });

});
