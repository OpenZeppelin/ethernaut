pragma solidity 0.4.24;

import './base/Level.sol';
import './Switch.sol';

contract SwitchFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    Switch _switch = new Switch();
    return _switch;
  }

  function validateInstance(address _instance, address) public returns (bool) {
    Switch _switch = Switch(_instance);
    return _switch.switchOn();
  }

}
