// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface IForta {
    function setAgent(address agentAddress) external;
    function notify(address user) external returns(bool);
    function raiseAlert(address user) external;
}

contract Agent {

  IForta public fortaContract;

  constructor(address forta) public {
    fortaContract = IForta(forta);
  }
  
  function handleTransaction(address user) public returns(bool) {
    // Only the Forta contract can call this method
    require(msg.sender == address(fortaContract), "Unauthorized");
    fortaContract.raiseAlert(user);
    return true;
  }
}
