// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BankBuilder {
    uint256 public count;

    function deployBankContract(bytes32 salt, address payable xyz) public payable{
        require(count==0, "Can only be called once");
        // Here salt is catched form of integer 123 in bytes32;
        Bank bank = new Bank{salt: salt, value: msg.value}();
        bank.transferFunds(xyz);
        count++;
    }

}


contract Recipient {
    address public desiredRecipintAddress;
    constructor(address _recipintAddress) {
        desiredRecipintAddress = _recipintAddress;
     }

    function killcontract(address payable to) external {
        require(address(this) == desiredRecipintAddress);
        selfdestruct(payable(to));
    }

}

contract Bank {
    address public owner;
    constructor() payable {
        owner = msg.sender;
    }

    function transferFunds(address payable addr) public{
        require(msg.sender==owner, "can only be called by owner");
        payable(addr).transfer(address(this).balance);
    }

    function deployRecipient(address recipintAddress) public payable returns(address) {
        return address(new Recipient(recipintAddress));
    }

}


