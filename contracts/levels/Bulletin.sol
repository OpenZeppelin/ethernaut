pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Bulletin is Ownable{

  bool public member;
  bytes32[] public messages;

  modifier isMember() {
    assert(member);
    _;
  }
  
  // To join the bulletin, you have to submit A LOT of sample content
  function join_bulletin(bytes32[] _samples) public {
    assert(_samples.length > 2*200);
    member = true;
  }

  // Adds a new message to the bulletin
  function post(bytes32 _content) isMember public {
  	messages.push(_content);
  }

  // Removes the latest message to the bulletin
  function pop() isMember public {
    messages.length--;
  }

  function edit(uint i, bytes32 val) isMember public {
    messages[i] = val;
  }
}