// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Dummy {
  bool public completed;
  function setCompleted(bool _completed) public {
    completed = _completed;
  }
}
