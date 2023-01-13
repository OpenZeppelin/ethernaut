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
        await attacker.registerContract();
        await attacker.destroyContract();
        await attacker.deployLargeContract();
        await attacker.unlock();

        const completed = await utils.submitLevelInstance(
            ethernaut,
            level.address,
            instance.address,
            player
        );

        assert.isTrue(completed);
    });
});
