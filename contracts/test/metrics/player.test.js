const Statistics = artifacts.require('./metrics/Statistics.sol');
const chai = require('chai');
const { expect } = chai;
const { solidity } = require('ethereum-waffle');
const { ethers } = require('ethers');

chai.use(solidity);

contract('Player metrics', (accounts) => {
  let statistics;

  let [
    ETHERNAUT_ADDRESS,
    PLAYER_ADDRESS_1,
    PLAYER_ADDRESS_2,
    PLAYER_ADDRESS_3,
    LEVEL_FACTORY_ADDRESS_1,
    LEVEL_FACTORY_ADDRESS_2,
    LEVEL_INSTANCE_ADDRESS_1,
    LEVEL_INSTANCE_ADDRESS_2,
    LEVEL_INSTANCE_ADDRESS_3
  ] = accounts;

  describe('Statistics', function () {
    describe('Creation of statistics contract', () => {
      it('should create a new statistics contract', async () => {
        statistics = await Statistics.new();
        await statistics.initialize(ETHERNAUT_ADDRESS);
        expect(statistics.address).to.contain('0x');
      });
    });

    describe('Addition of a new level factory address', () => {
      it('should add a new level factory address', async () => {
        await statistics.saveNewLevel(LEVEL_FACTORY_ADDRESS_1);
        await expect(await statistics.doesLevelExist(LEVEL_FACTORY_ADDRESS_1)).to.be.true;
      });

      it('should prevent the addition of already added level factory', async () => {
        await expect(statistics.saveNewLevel(LEVEL_FACTORY_ADDRESS_1))
          .to.be.revertedWith("Level already exists");
        await expect(await statistics.doesLevelExist(LEVEL_FACTORY_ADDRESS_2)).to.be.false;
      });
    });


    describe('Creation of a level instance', () => { 
        it('should create a new level stats instance', async () => { 
          await statistics.createNewInstance(LEVEL_INSTANCE_ADDRESS_1, LEVEL_FACTORY_ADDRESS_1, PLAYER_ADDRESS_1);
        })

        it('checks if player address is correctly added to players list', async () => { 
          await expect(await statistics.doesPlayerExist(PLAYER_ADDRESS_1)).to.be.true;
        })

        it('should throw error if invalid level factory address provided during level stats creation', async () => { 
          await expect(statistics.createNewInstance(LEVEL_INSTANCE_ADDRESS_1, LEVEL_FACTORY_ADDRESS_2, PLAYER_ADDRESS_1))
                .to.be.revertedWith("Level doesn't exist");
        })
    })

    describe("Success submission of a level instance", () => { 
        it('should submit success for a level instance', async () => { 
          await statistics.submitSuccess(LEVEL_INSTANCE_ADDRESS_1, LEVEL_FACTORY_ADDRESS_1, PLAYER_ADDRESS_1);
          await expect(await statistics.isLevelCompleted(PLAYER_ADDRESS_1, LEVEL_FACTORY_ADDRESS_1)).to.be.true;
          const timeElapsed = await statistics.getTimeElapsedForCompletionOfLevel(PLAYER_ADDRESS_1, LEVEL_FACTORY_ADDRESS_1)
          await expect(timeElapsed>0).to.be.true
        })
      
        it('should throw error if invalid player address provided during level submission', async () => {
          await expect(statistics.submitSuccess(LEVEL_INSTANCE_ADDRESS_1, LEVEL_FACTORY_ADDRESS_1, PLAYER_ADDRESS_2))
                .to.be.revertedWith("Player doesn't exist");
        })
      
        it('should throw error if player has not created a level instance yet and tries to submit', async () => { 
          await statistics.saveNewLevel(LEVEL_FACTORY_ADDRESS_2);
          await statistics.createNewInstance(LEVEL_INSTANCE_ADDRESS_2, LEVEL_FACTORY_ADDRESS_2, PLAYER_ADDRESS_2);
          await expect(statistics.submitSuccess(LEVEL_INSTANCE_ADDRESS_1, LEVEL_FACTORY_ADDRESS_1, PLAYER_ADDRESS_2))
                .to.be.revertedWith("Instance for the level is not created");
        })
      
        it('should not allow submission of a level that is completed', async () => {
          await expect(statistics.submitSuccess(LEVEL_INSTANCE_ADDRESS_1, LEVEL_FACTORY_ADDRESS_1, PLAYER_ADDRESS_1))
            .to.be.revertedWith("Level already completed");
        })
    })

    describe("Failure submission of a level instance", () => { 
      it('should submit failure for a level instance', async () => { 
        await statistics.createNewInstance(LEVEL_INSTANCE_ADDRESS_2, LEVEL_FACTORY_ADDRESS_2, PLAYER_ADDRESS_1);
        // Submitting 2 failures for the same level instance
        await statistics.submitFailure(LEVEL_INSTANCE_ADDRESS_2, LEVEL_FACTORY_ADDRESS_2, PLAYER_ADDRESS_1);
        await statistics.submitFailure(LEVEL_INSTANCE_ADDRESS_2, LEVEL_FACTORY_ADDRESS_2, PLAYER_ADDRESS_1);
        await expect(await statistics.isLevelCompleted(PLAYER_ADDRESS_2, LEVEL_FACTORY_ADDRESS_2)).to.be.false;
      })
    })

    describe("Total number of levels created", async () => {
      it('should return total number of levels created', async () => {
        const totalLevels = await statistics.getTotalNoOfLevelInstancesCreatedByPlayer(PLAYER_ADDRESS_1);
        await expect(totalLevels.toNumber()).to.equal(2);
      })

      it('should return total number of levels completed', async () => {
        const totalLevels = await statistics.getTotalNoOfLevelInstancesCompletedByPlayer(PLAYER_ADDRESS_1);
        await expect(totalLevels.toNumber()).to.equal(1);
      })

      it('should return total number of levels failed', async () => {
        const totalLevels = await statistics.getTotalNoOfFailedSubmissionsByPlayer(PLAYER_ADDRESS_1);
        await expect(totalLevels.toNumber()).to.equal(2);
      })

      it('should return percentange of levels completed', async () => { 
        const percentage = await statistics.getPercentageOfLevelsCompleted(PLAYER_ADDRESS_1);
        expect(ethers.utils.formatEther(percentage.toString())).to.equal("0.5")
      })
    })
  });

  describe("Calculation of time taken for completion of a level", async () => { 
    it('should calculate time taken for completion of a level', async () => { 
      await statistics.createNewInstance(LEVEL_INSTANCE_ADDRESS_1, LEVEL_FACTORY_ADDRESS_1, PLAYER_ADDRESS_3);
      await statistics.createNewInstance(LEVEL_INSTANCE_ADDRESS_2, LEVEL_FACTORY_ADDRESS_1, PLAYER_ADDRESS_3);
      await statistics.createNewInstance(LEVEL_INSTANCE_ADDRESS_3, LEVEL_FACTORY_ADDRESS_1, PLAYER_ADDRESS_3);
      await statistics.submitSuccess(LEVEL_INSTANCE_ADDRESS_3, LEVEL_FACTORY_ADDRESS_1, PLAYER_ADDRESS_3);
      expect((await statistics.getTimeElapsedForCompletionOfLevel(PLAYER_ADDRESS_3, LEVEL_FACTORY_ADDRESS_1)).toNumber()).to.equal(3);
    })
  })
});

