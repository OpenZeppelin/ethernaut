pragma solidity ^0.4.24;

import 'openzeppelin-eth/contracts/ownership/Ownable.sol';

import 'zos-lib/contracts/upgradeability/AdminUpgradeabilityProxy.sol';

contract Level is Ownable {
  
  address internal instanceImplementation;

  // Will be called upon level proxy creation.
  function initialize() public initializer {
    defineInstanceImplementation();
  }

  // These need to be overriden/defined by level creators.
  function defineInstanceImplementation() private;
  function createInstance(address _player) public payable returns (address);
  function validateInstance(address _instance, address _player) public returns (bool);

  // -------------
  // Utils.
  // -------------

  function createInstanceProxy(bytes _data) internal returns (AdminUpgradeabilityProxy) {
    return new AdminUpgradeabilityProxy(instanceImplementation, _data);
  }
}
