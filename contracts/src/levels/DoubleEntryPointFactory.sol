// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./DoubleEntryPoint.sol";
import "./base/Level.sol";

contract DoubleEntryPointFactory is Level {
    function createInstance(address _player) public payable override returns (address) {
        // Create legacy token
        LegacyToken oldToken = new LegacyToken();
        // Create a new Forta contract
        Forta forta = new Forta();
        // Create a new CryptoVault
        CryptoVault vault = new CryptoVault(_player);
        // Create latest token
        DoubleEntryPoint newToken = new DoubleEntryPoint(address(oldToken), address(vault), address(forta), _player);
        // Set underlying in CryptoVault
        vault.setUnderlying(address(newToken));

        // Activate legacy support to newToken
        oldToken.delegateToNewContract(DelegateERC20(address(newToken)));

        // Give CryptoVault some LGT (LegacyTokens)
        oldToken.mint(address(vault), 100 ether);

        return address(newToken);
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        DoubleEntryPoint instance = DoubleEntryPoint(_instance);
        Forta forta = instance.forta();

        // If user didn't set an DetectionBot, level failed.
        address usersDetectionBot = address(forta.usersDetectionBots(_player));
        if (usersDetectionBot == address(0)) return false;

        address vault = instance.cryptoVault();
        CryptoVault cryptoVault = CryptoVault(vault);

        (bool ok, bytes memory data) = this.__trySweep(cryptoVault, instance);

        require(!ok, "Sweep succeded");

        bool swept = abi.decode(data, (bool));
        return swept;
    }

    function __trySweep(CryptoVault cryptoVault, DoubleEntryPoint instance) external returns (bool, bytes memory) {
        try cryptoVault.sweepToken(IERC20(instance.delegatedFrom())) {
            return (true, abi.encode(false));
        } catch {
            return (false, abi.encode(instance.balanceOf(instance.cryptoVault()) > 0));
        }
    }
}
