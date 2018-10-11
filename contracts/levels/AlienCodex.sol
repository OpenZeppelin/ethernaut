pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract AlienCodex is Ownable {

  bool public contact;
  bytes32[] public codex;

  modifier contacted() {
    assert(contact);
    _;
  }
  
  function make_contact(bytes32[] _impossible_message) public {
    assert(_impossible_message.length > 2**200);
    contact = true;
  }

  function push(bytes32 _content) contacted public {
  	codex.push(_content);
  }

  function pop() contacted public {
    codex.length--;
  }

  function edit(uint i, bytes32 _content) contacted public {
    codex[i] = _content;
  }
}