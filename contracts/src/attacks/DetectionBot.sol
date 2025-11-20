// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDetectionBot {
    function handleTransaction(address user, bytes calldata msgData) external;
}

interface IForta {
    function setDetectionBot(address detectionBotAddress) external;
    function notify(address user, bytes calldata msgData) external;
    function raiseAlert(address user) external;
}

contract DetectionBot is IDetectionBot {
    IForta public fortaContract;
    address public cryptoVaultContract;

    constructor(address forta, address cryptoVault) {
        fortaContract = IForta(forta);
        cryptoVaultContract = cryptoVault;
    }

    function handleTransaction(address user, bytes calldata msgData) public override {
        // Only the Forta contract can call this method
        require(msg.sender == address(fortaContract), "Unauthorized");

        // Decode the parameters of the delegateTransfer method
        (, , address origSender) = abi.decode(
            msgData[4:],
            (address, uint256, address)
        );

        // The origSender mustn't be the CryptoVault
        // because DoubleEntryPoint is an underlying token,
        // if so raise an alert
        if (origSender == cryptoVaultContract)
            fortaContract.raiseAlert(user);
    }
}
