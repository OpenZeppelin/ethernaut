const Statistics = artifacts.require('./metrics/Statistics.sol');
const chai = require('chai');
const { expect } = chai;
const { solidity } = require('ethereum-waffle');
const { time } =  require("@nomicfoundation/hardhat-network-helpers");
​
chai.use(solidity);
​
contract('Player metrics', (accounts) => {
  let statistics;
​
  let [
    ETHERNAUT_ADDRESS,
    PLAYER_ADDRESS_1,
    LEVEL_FACTORY_ADDRESS_1,
    LEVEL_FACTORY_ADDRESS_2,
    LEVEL_FACTORY_ADDRESS_3,
    LEVEL_INSTANCE_ADDRESS_1,
    LEVEL_INSTANCE_ADDRESS_2,
    LEVEL_INSTANCE_ADDRESS_3
  ] = accounts;
    
  let TIME_1, TIME_2, TIME_3;
​
describe('Statistics', function () {
    before(async () => { 
      statistics = await Statistics.new();
      await statistics.initialize(ETHERNAUT_ADDRESS);
​
      await statistics.saveNewLevel(LEVEL_FACTORY_ADDRESS_1);
      await statistics.saveNewLevel(LEVEL_FACTORY_ADDRESS_2);
      await statistics.saveNewLevel(LEVEL_FACTORY_ADDRESS_3);
​
      await statistics.createNewInstance(LEVEL_INSTANCE_ADDRESS_1, LEVEL_FACTORY_ADDRESS_1, PLAYER_ADDRESS_1);
      await time.increase(9);
      await statistics.submitSuccess(LEVEL_INSTANCE_ADDRESS_1, LEVEL_FACTORY_ADDRESS_1, PLAYER_ADDRESS_1);
​
      await statistics.createNewInstance(LEVEL_INSTANCE_ADDRESS_2, LEVEL_FACTORY_ADDRESS_2, PLAYER_ADDRESS_1);
      await time.increase(19);
      await statistics.submitSuccess(LEVEL_INSTANCE_ADDRESS_2, LEVEL_FACTORY_ADDRESS_2, PLAYER_ADDRESS_1);
​
      await statistics.createNewInstance(LEVEL_INSTANCE_ADDRESS_3, LEVEL_FACTORY_ADDRESS_3, PLAYER_ADDRESS_1);
      await time.increase(14);
      await statistics.submitSuccess(LEVEL_INSTANCE_ADDRESS_3, LEVEL_FACTORY_ADDRESS_3, PLAYER_ADDRESS_1);
    })
        
    describe('Average time taken to complete level', () => {       
      it('check the retrieval of time taken to complete levels', async () => {
        TIME_1 = (await statistics.getTimeElapsedForCompletionOfLevel(PLAYER_ADDRESS_1, LEVEL_FACTORY_ADDRESS_1)).toNumber()
        TIME_2 = (await statistics.getTimeElapsedForCompletionOfLevel(PLAYER_ADDRESS_1, LEVEL_FACTORY_ADDRESS_2)).toNumber()
        TIME_3 = (await statistics.getTimeElapsedForCompletionOfLevel(PLAYER_ADDRESS_1, LEVEL_FACTORY_ADDRESS_3)).toNumber()
        expect(TIME_1).to.equal(10)
        expect(TIME_2).to.equal(20)  
        expect(TIME_3).to.equal(15)  
      });
​
      it('tests calculation of average time taken to complete level', async () => { 
        let AVERAGE_TIME = (await statistics.getAverageTimeTakenToCompleteLevelsByPlayer(PLAYER_ADDRESS_1)).toNumber()
        expect(AVERAGE_TIME).to.equal((TIME_1 + TIME_2 + TIME_3) / 3);
      })
    });
  });
});