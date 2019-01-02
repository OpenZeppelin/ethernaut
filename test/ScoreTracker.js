/*eslint no-undef: "off"*/
const ScoreTracker = artifacts.require("./ScoreTracker.sol");
const ERC20MintableDetailed = artifacts.require("./ERC20MintableDetailed.sol");
import expectThrow from "zeppelin-solidity/test/helpers/expectThrow";

contract("ScoreTracker", function(accounts) {
  let owner = accounts[0];
  let player = accounts[1];
  let level1 = accounts[5];
  let level2 = accounts[6];

  let instance;

  beforeEach(async function() {
    instance = await ScoreTracker.new("Score Token", "STKN");
  });

  it("should initalise a token", async () => {
    const tokenAddress = await instance.scoreToken();
    const token = await ERC20MintableDetailed.at(tokenAddress);
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();

    expect(name).equal("Score Token");
    expect(symbol).equal("STKN");
    expect(decimals.toString()).equal("0");
  });

  it("should throws if non-owners call levelCompleted", async () => {
    await instance.registerLevel(level1, 10);
    await expectThrow(
      instance.levelCompleted(player, level1, { from: player })
    );
  });

  it("should throws if level is uninitialised", async () => {
    await expectThrow(instance.levelCompleted(player, level1));
  });

  it("should award a player the first time he completed a level", async () => {
    const tokenAddress = await instance.scoreToken();
    const token = await ERC20MintableDetailed.at(tokenAddress);

    let playerBalance = await token.balanceOf(player);
    expect(playerBalance.toString()).equal("0");

    await instance.registerLevel(level1, 10);

    await instance.levelCompleted(player, level1);
    playerBalance = await token.balanceOf(player);
    expect(playerBalance.toString()).equal("10");
  });

  it("should award a player for multiple levels", async () => {
    const tokenAddress = await instance.scoreToken();
    const token = await ERC20MintableDetailed.at(tokenAddress);

    await instance.registerLevel(level1, 10);
    await instance.registerLevel(level2, 20);

    await instance.levelCompleted(player, level1);
    let playerBalance = await token.balanceOf(player);
    expect(playerBalance.toString()).equal("10");

    await instance.levelCompleted(player, level2);
    playerBalance = await token.balanceOf(player);
    expect(playerBalance.toString()).equal("30");
  });

  it("should not award the same player after the first time he completed a level", async () => {
    const tokenAddress = await instance.scoreToken();
    const token = await ERC20MintableDetailed.at(tokenAddress);

    await instance.registerLevel(level1, 10);

    await instance.levelCompleted(player, level1);
    let playerBalance = await token.balanceOf(player);
    expect(playerBalance.toString()).equal("10");

    await instance.levelCompleted(player, level1);
    playerBalance = await token.balanceOf(player);
    expect(playerBalance.toString()).equal("10");
  });
});
