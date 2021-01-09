pragma solidity ^0.4.24;

contract Switch {
  bool public switchOn; // switch is off
  bytes4 public offSelector = bytes4(keccak256("turnSwitchOff()"));

  function flipSwitch(bytes _data) onlyOff public
  {
      require(address(this).call(_data), "call failed :(");
  }

  function turnSwitchOn() onlyThis public  {
      switchOn = true;
  }

  function turnSwitchOff() onlyThis public {
     switchOn = false;
  }

  modifier onlyThis {
      require(msg.sender == address(this), "Only the contract can call this");
      _;
  }

  modifier onlyOff {
    // we use a complex data type to put in memory
    bytes32[1] memory selector;
    // check that the calldata at position 68 (location of _data)
    assembly {
      calldatacopy(selector, 68, 4) // grab function selector from calldata
    }
    require(selector[0] == offSelector, "Can only call the turnOffSwitch function");
    _;
  }
}
