// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ShapeShifter {
  address public userContract;
  uint public contractSize;
  bool public unlocked;

  function submitContract(address _userContract) public {
    require(_userContract.code.length > 0, "Address must be a deployed smart contract");
    userContract = _userContract;
    contractSize = _userContract.code.length;
  }

  function unlock() public {
    require(userContract != address(0), "Contract not set");
    if(userContract.code.length > contractSize) {
      unlocked = true;
    }
  }
}
