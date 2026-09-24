// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Level} from "./base/Level.sol";
import {GhostVault, IGhostVaultFactory} from "./GhostVault.sol";

import {ERC20} from "openzeppelin-contracts-v5.4.0/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin-contracts-v5.4.0/access/Ownable.sol";

contract DepositToken is ERC20, Ownable {
    constructor() ERC20("Deposit Token", "DPT") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

contract GhostVaultFactory is Level, IGhostVaultFactory {
    DepositToken public immutable DPT;
    address constant BOB = address(0xB0B);
    uint256 constant PLAYER_INITIAL_BALANCE = 1_000 ether;
    uint256 constant BOB_DEPOSIT_AMOUNT = 100 ether;

    mapping(address => bool) public bobHasDeposited;

    constructor() {
        DPT = new DepositToken();
    }

    function createInstance(address _player) public payable override returns (address) {
        GhostVault instance = new GhostVault(DPT, this);
        DPT.mint(_player, PLAYER_INITIAL_BALANCE);
        return address(instance);
    }

    /// @notice Simulates Bob, the vault's next "real" depositor, arriving
    /// after the player. Only the instance itself can call this, in
    /// response to the player calling GhostVault.triggerBobDeposit() from
    /// the console, mirroring the moment a real user's deposit transaction
    /// lands on top of an attacker's setup.
    ///
    /// This lives behind an explicit trigger instead of running as a side
    /// effect of validateInstance: bundling it into validateInstance would
    /// mean a routine "check my progress" call (submitLevelInstance can be
    /// called at any time, including by tests that assert the level isn't
    /// solved yet) silently burns Bob's deposit against an unexploited
    /// vault and permanently soft-locks that instance.
    function fundBobDeposit(address instance) external override {
        require(msg.sender == instance, "Only the instance can request its own funding");
        require(!bobHasDeposited[instance], "Bob already deposited");
        bobHasDeposited[instance] = true;

        DPT.mint(address(this), BOB_DEPOSIT_AMOUNT);
        DPT.approve(instance, BOB_DEPOSIT_AMOUNT);
        GhostVault(instance).deposit(BOB_DEPOSIT_AMOUNT, BOB);
    }

    function validateInstance(address payable _instance, address _player) public view override returns (bool) {
        GhostVault instance = GhostVault(_instance);

        bool bobGotNothing = bobHasDeposited[_instance] && instance.balanceOf(BOB) == 0;
        bool playerProfited = instance.convertToAssets(instance.balanceOf(_player)) > PLAYER_INITIAL_BALANCE;

        return bobGotNothing && playerProfited;
    }
}
