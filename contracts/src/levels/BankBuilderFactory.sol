// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./BankBuilder.sol";

contract BankBuilderFactory is Level {
    BankBuilder private bankBuilderInstance;
    Bank private bankInstance;
    uint256 public initialDeposit = 0.001 ether;
    function createInstance(address _player) public payable override returns (address) {   
        _player;
        require(msg.value >= initialDeposit);    
        bankBuilderInstance = new BankBuilder();
        bankBuilderInstance.deployBankContract{value: msg.value}(getBytes32(), payable(generateAddressofRecipient(generateAddressofBank(getBytes32()))));
        return address(bankBuilderInstance);
    }

    function generateAddressofRecipient(address sender) internal  returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xd6), bytes1(0x94), sender, bytes1(0x05)));
        address addr = address(uint160(uint256(hash)));
        return addr;
    }

    function generateAddressofBank(bytes32 salt) public view returns (address) {
        address str = address(uint160(uint(keccak256(abi.encodePacked(
            bytes1(0xff),
            address(bankBuilderInstance),
            salt,
            keccak256(abi.encodePacked(
                type(Bank).creationCode
            ))
        )))));

        return str;
    }

    function getBytes32() internal pure returns (bytes32) {
        uint256 salt = 123; // fixed
        return bytes32(salt);
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        // _player;
        return address(bankBuilderInstance).balance >= initialDeposit;
    }

}
