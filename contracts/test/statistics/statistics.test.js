const Statistics = artifacts.require('./statistics/Statistics.sol')
var { expect } = require('chai');  

contract('Statistics', () => { 
    let statistics
    describe('Statistics', function () { 
        it('tests statistics contract creation', async () => { 
            statistics = await Statistics.new()
            expect(statistics.address).to.contain("0x")
        })
    })
})