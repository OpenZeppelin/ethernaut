pragma solidity ^0.4.24;

import "./base/LevelInstance.sol";

contract HelloInstance is LevelInstance {

  string public password;
  uint8 public infoNum;
  string public theMethodName;
  bool private cleared;

  function start(address _owner, string _password) public initializer {
    super.initialize(_owner);

    password = _password;
    infoNum = 42;
    theMethodName = 'The method name is method7123949';
    cleared = false;
  }

  function info() public pure returns (string) {
    return 'You will find what you need in info1().';
  }

  function info1() public pure returns (string) {
    return 'Try info2(), but with "hello" as a parameter.';
  }

  function info2(string param) public pure returns (string) {
    if(keccak256(param) == keccak256('hello')) {
      return 'The property infoNum holds the number of the next info method to call.';
    }
    return 'Wrong parameter.';
  }

  function info42() public pure returns (string) {
    return 'theMethodName is the name of the next method.';
  }

  function method7123949() public pure returns (string) {
    return 'If you know the password, submit it to authenticate().';
  }

  function authenticate(string passkey) public {
    if(keccak256(passkey) == keccak256(password)) {
      cleared = true;
    }
  }

  function getCleared() public view returns (bool) {
    return cleared;
  }
}
