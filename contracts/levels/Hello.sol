pragma solidity ^0.4.24;

import './base/Level.sol';
import './HelloInstance.sol';

contract Hello is Level {

  function defineInstanceImplementation() private {
    instanceImplementation = new HelloInstance();
  }

  function createInstance(address) public payable returns (address) {
    return createInstanceProxy(abi.encodeWithSignature('start(address,string)', address(this), 'ethernaut0')); 
  }

  function validateInstance(address _instance, address) public returns (bool) {
    HelloInstance hello = HelloInstance(_instance);
    return hello.getCleared();
  }
}
