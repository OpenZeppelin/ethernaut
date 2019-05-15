pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Fallback {

  using SafeMath for uint256;
  mapping(address => uint) public contributions;
  address payable _owner;

  constructor() public {
    _owner = msg.sender;
    contributions[msg.sender] = 1000 * (1 ether);
  }

   function owner() public view returns (address payable) {
        return _owner;
    }

  modifier onlyOwner {
        require(
            msg.sender == _owner,
            "Only owner can call this function."
        );
        _;
    }

  function contribute() public payable {
    require(msg.value < 0.001 ether);
    contributions[msg.sender] += msg.value;
    if(contributions[msg.sender] > contributions[_owner]) {
      _owner = msg.sender;
    }
  }

  function getContribution() public view returns (uint) {
    return contributions[msg.sender];
  }

  function withdraw() public onlyOwner {
    _owner.transfer(address(this).balance);
  }

  function() payable external {
    require(msg.value > 0 && contributions[msg.sender] > 0);
    _owner = msg.sender;
  }
}
