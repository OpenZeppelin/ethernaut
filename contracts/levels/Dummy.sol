pragma solidity ^0.4.0;

contract Dummy {
  bool public completed;
  function setCompleted(bool _completed) public {
    completed = _completed;
  }
}
