pragma solidity ^0.4.18;

contract Vault {
  bool public isUnlocked;
  uint256 private pin;

  function Vault(uint256 _pin) {
    isUnlocked = false;
    pin = _pin;
  }

  function unlock(uint256 _pin) public {
    if (pin == _pin) {
      isUnlocked = true;
    }
  }
}
