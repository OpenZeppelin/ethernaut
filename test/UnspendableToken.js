/*eslint no-undef: "off"*/
const UnspendableToken = artifacts.require("./UnspendableToken.sol");
import expectThrow from "zeppelin-solidity/test/helpers/expectThrow";

contract("UnspendableToken", function(accounts) {
  let owner = accounts[0];
  let acc1 = accounts[1];
  let acc2 = accounts[1];

  let token;

  beforeEach(async function() {
    token = await UnspendableToken.new("ScoreToken", "STKN", 0);
  });

  it("should initialise with the right parameter", async () => {
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();

    expect(name).equal("ScoreToken");
    expect(symbol).equal("STKN");
    expect(decimals.toString()).equal("0");
  });

  it("should allow minting to specific address", async () => {
    await token.mint(acc1, "10");
    const bal = await token.balanceOf(acc1);
    expect(bal.toString()).equal("10");
  });

  it("should not allow minting by non-owners", async () => {
    await expectThrow(token.mint(acc1, "10", {from: acc1}));
  });

  it("should not allow transfers", async () => {
    await token.mint(acc1, "10");
    await expectThrow(token.transfer(acc2, 10, {from: acc1}));
    await expectThrow(token.approve(acc2, 10, {from: acc1}));
    await expectThrow(token.transferFrom(acc1, acc2, 10, {from: acc2}));
    await expectThrow(token.increaseAllowance(acc2, 100, {from: acc1}));
    await expectThrow(token.decreaseAllowance(acc2, 10, {from: acc1}));
  });
});
