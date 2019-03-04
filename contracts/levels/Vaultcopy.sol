pragma solidity ^0.4.18;

contract Vaultcopy {
  bool public locked;
  bytes32 private password;

  function Vaultcopy(bytes32 _password) public {
    locked = true;
    password = _password;
  }

  function unlock(bytes32 _password) public {
    if (password == _password) {
      locked = false;
    }
  }
}
