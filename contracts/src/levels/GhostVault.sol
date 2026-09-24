// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC20} from "openzeppelin-contracts-v5.4.0/token/ERC20/ERC20.sol";
import {IERC20} from "openzeppelin-contracts-v5.4.0/token/ERC20/IERC20.sol";

interface IGhostVaultFactory {
    function fundBobDeposit(address instance) external;
}

/// @notice A minimal, hand-rolled ERC4626-style vault. It reinvents share
/// accounting instead of inheriting OpenZeppelin's ERC4626, which is exactly
/// how this bug keeps showing up in the wild: teams roll their own vault
/// math and skip the virtual-shares protection OZ's ERC4626 ships with.
contract GhostVault is ERC20 {
    IERC20 public immutable asset;
    IGhostVaultFactory public immutable factory;

    constructor(IERC20 _asset, IGhostVaultFactory _factory) ERC20("Ghost Vault Shares", "gDPT") {
        asset = _asset;
        factory = _factory;
    }

    function totalAssets() public view returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? assets : (assets * supply) / totalAssets();
    }

    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? shares : (shares * totalAssets()) / supply;
    }

    function previewDeposit(uint256 assets) external view returns (uint256) {
        return convertToShares(assets);
    }

    /// @dev No minimum-shares check and no virtual offset: a deposit that
    /// rounds down to 0 shares still pulls the caller's assets into the
    /// vault and mints nothing. That silent zero is the whole bug.
    function deposit(uint256 assets, address receiver) external returns (uint256 shares) {
        shares = convertToShares(assets);
        asset.transferFrom(msg.sender, address(this), assets);
        _mint(receiver, shares);
    }

    function redeem(uint256 shares, address receiver) external returns (uint256 assets) {
        assets = convertToAssets(shares);
        _burn(msg.sender, shares);
        asset.transfer(receiver, assets);
    }

    /// @notice Lets Bob, the vault's next "real" depositor, arrive. Callable
    /// once per instance, from the instance itself, so the player can trigger
    /// it the same way they call every other level function: contract.method().
    function triggerBobDeposit() external {
        factory.fundBobDeposit(address(this));
    }
}
