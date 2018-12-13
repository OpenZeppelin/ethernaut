const PuzzleFactory = artifacts.require('./levels/PuzzleFactory.sol')
const Puzzle = artifacts.require('./levels/Puzzle.sol')

const Ethernaut = artifacts.require('./Ethernaut.sol')

import * as utils from '../utils/TestUtils'
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow'
import toPromise from 'zeppelin-solidity/test/helpers/toPromise'

contract('Puzzle', function(accounts) {

  let ethernaut
  let level
  let instance
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await PuzzleFactory.new()
    await ethernaut.registerLevel(level.address)
    instance = await utils.createLevelInstance(
        ethernaut, level.address, player, Puzzle, 
        {from: player, value: web3.toWei(1, 'ether')})
  });

  describe('instance', function() {

    it('should not be immediately solvable', async function() {
        const ethCompleted = await utils.submitLevelInstance(
            ethernaut,
            level.address,
            instance.address,
            player
        )
        assert.equal(ethCompleted,false);
     });

    it('should not be solvable with the incorrect solution', async function() {
        let incorrectSolution = "0x46d7cadd4b0699c1a096a4793f84eda2" //random solution attempt, should fail
        await instance.solve(incorrectSolution); 
        const ethCompleted = await utils.submitLevelInstance(
            ethernaut,
            level.address,
            instance.address,
            player
        )
        assert.equal(ethCompleted,false);
    });

    it('should be solvable with the correct solution', async function() {
        instance = await utils.createLevelInstance(
            ethernaut, level.address, player, Puzzle, 
            {from: player, value: web3.toWei(1, 'ether')}
        )
        //address of contract containing correct solution in code
        let solverContractAddress = web3.eth.getStorageAt(instance.address, 0)
        let solverContractCode = web3.eth.getCode(solverContractAddress)
        /*
        The following line slices the secret code out of the contract code.
        When actually playing, a player is expected to use a tool to convert
        the bytecode to opcodes and then find the secret code
        */
        let secretCode = "0x" + solverContractCode.slice(344,344+32)
        assert.equal(secretCode,"0x1ced777decaf777c0ffee77777777777")
        //solve the puzzle
        await instance.solve(secretCode);
        //funds should be transferred to puzzle solver
        assert.equal(web3.eth.getBalance(instance.address),0)

        //submit to Ethernaut.sol
        const ethCompleted = await utils.submitLevelInstance(
            ethernaut,
            level.address,
            instance.address,
            player
        );
        //level should be completed
        assert.equal(ethCompleted, true);
    });
  });

});
