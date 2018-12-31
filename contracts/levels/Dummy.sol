pragma solidity ^0.5.0;

contract Dummy {
  bool public completed;
  function setCompleted(bool _completed) public {
    completed = _completed;
  }
}
