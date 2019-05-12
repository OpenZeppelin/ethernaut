pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Fallout is Ownable {
  
  // using SafeMath for uint256;
  // mapping (address => uint) allocations;

  // /* constructor */
  // function Fal1out() public payable {
  //   owner = msg.sender;
  //   allocations[owner] = msg.value;
  // }

  // function allocate() public payable {
  //   allocations[msg.sender] = allocations[msg.sender].add(msg.value);
  // }

  // function sendAllocation(address payable allocator) public {
  //   require(allocations[allocator] > 0);
  //   allocator.transfer(allocations[allocator]);
  // }

  // function collectAllocations() public onlyOwner {
  //   msg.sender.transfer(address(this).balance);
  // }

  // function allocatorBalance(address allocator) public view returns (uint) {
  //   return allocations[allocator];
  // }
}
