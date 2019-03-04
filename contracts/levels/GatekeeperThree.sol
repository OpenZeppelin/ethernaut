pragma solidity ^0.4.24;

contract SimpleTrick {

  GatekeeperThree public target = GatekeeperThree(0x0);
  address public trick;
  uint private password = now;

  constructor (address _target) public {
    target = GatekeeperThree(_target);
  }
    
  function checkPassword(uint _password) returns (bool) {
    if (_password == password) {
      return true;
    }
    password = now;
    return false;
  }
    
  function trickInit() public {
    trick = address(this);
  }
    
  function trickyTrick() public {
    if (address(this) == msg.sender && address(this) != trick) {
      target.call(bytes4(keccak256("getAllowance(uint256)")), password);    
    }
  }
}

contract GatekeeperThree {

  address public owner;
  address public entrant;
  bool public allow_enterance = false;
  SimpleTrick public trick;

  function constructor() public {
      owner = msg.sender;
  }

  modifier gateOne() {
    require(msg.sender == owner);
    require(tx.origin != owner);
    _;
  }

  modifier gateTwo() {
    require(allow_enterance == true);
    _;
  }

  modifier gateThree() {
    if (address(this).balance > 0.001 ether && owner.send(0.001 ether) == false) {
      _;
    }
  }

  function getAllowance(uint _password) public {
    if (trick.checkPassword(_password)) {
        allow_enterance = true;
    }
  }

  function createTrick() public {
    trick = new SimpleTrick(address(this));
    trick.trickInit();
  }

  function enter() public gateOne gateTwo gateThree returns (bool) {
    entrant = tx.origin;
    return true;
  }

  function () public payable {}
}
