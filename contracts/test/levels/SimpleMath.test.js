const { expect } = require("chai");

describe("SimpleMath Level", function () {
  let contract;

  beforeEach(async function () {
    const SimpleMath = await ethers.getContractFactory("SimpleMath");
    contract = await SimpleMath.deploy();
    await contract.deployed();
  });

  it("should overflow the result", async function () {
    await contract.multiply(20, 13); // 20*13 = 260 > uint8 max 255
    const result = await contract.result();
    expect(result).to.be.lt(260); // overflow happened
  });
});