const Statistics = artifacts.require('./metrics/Statistics.sol')
const chai = require('chai'); 
const { expect } = chai; 
const { solidity } = require('ethereum-waffle');

chai.use(solidity);

contract('Statistics', (accounts) => { 
    let statistics

    let [
        PLAYER_ADDRESS_1,
        LEVEL_FACTORY_ADDRESS_1, LEVEL_FACTORY_ADDRESS_2,
        LEVEL_INSTANCE_ADDRESS_1
    ] = accounts

    describe('Statistics', function () { 
        describe('Creation of statistics contract', () => { 
            it('should create a new statistics contract', async () => { 
                statistics = await Statistics.new()
                expect(statistics.address).to.contain("0x")
            })
        })
        
        describe('Addition of a new level factory address', () => { 
            it('should add a new level factory address', async () => { 
                await statistics.saveNewLevel(LEVEL_FACTORY_ADDRESS_1)
                expect(await statistics.levels(0)).to.equal(LEVEL_FACTORY_ADDRESS_1)
            })
        })

        describe('Creation of a level instance', () => { 
            it('should create a new level stats instance', async () => { 
                await statistics.createNewInstance(LEVEL_INSTANCE_ADDRESS_1, LEVEL_FACTORY_ADDRESS_1, PLAYER_ADDRESS_1)
            })

            it('checks if player address is successfully added to players list', async () => { 
                expect(await statistics.playerExists(PLAYER_ADDRESS_1)).to.equal(true)
            })

            it('should throw error if invalid level factory address provided during level stats creation', async () => { 
                await expect(statistics.createNewInstance(LEVEL_INSTANCE_ADDRESS_1, LEVEL_FACTORY_ADDRESS_2, PLAYER_ADDRESS_1))
                    .to.be.revertedWith("Invalid level factory address")
            })
        })
    })
})