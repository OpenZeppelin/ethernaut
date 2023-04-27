const DisrupBetFactory = artifacts.require('./levels/DisrupBetFactory.sol');
const DisrupBet = artifacts.require('./levels/DisrupBet.sol');
const utils = require('../utils/TestUtils');


contract('DisrupBet', function (accounts) {
  let ethernaut;
  let level;
  let player = accounts[0];

  beforeEach(async function () {
    ethernaut = await utils.getEthernautWithStatsProxy();
    level = await DisrupBetFactory.new();
    await ethernaut.registerLevel(level.address);
  
  });

  it("check bets", async () => {
    const instance = await utils.createLevelInstance(
      ethernaut,
      level.address,
      player,
      DisrupBet,
      { from: player }
    );
    const betTxn = await instance.totalBettedAmount();      
    assert(betTxn > 0, "the amount bet must be greater than 0")
  })

  it("Return error bet", async () => {
    const instance = await utils.createLevelInstance(
      ethernaut,
      level.address,
      player,
      DisrupBet,
      { from: player }
    );
    await expect(instance.bet(1, {value: '00001'})).to.be.revertedWith("Bet out of time range")
  
  })
});
