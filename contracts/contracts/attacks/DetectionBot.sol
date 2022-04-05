// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface IDetectionBot {
    function handleTransaction(address user, bytes calldata msgData) external;
}

interface IForta {
    function setDetectionBot(address detectionBotAddress) external;
    function notify(address user, bytes calldata msgData) external;
    function raiseAlert(address user) external;
}

contract DetectionBot is IDetectionBot {

  IForta public fortaContract;

  constructor(address forta) public {
    fortaContract = IForta(forta);
  }
  
  function handleTransaction(address user, bytes calldata msgData) public override {
    // Only the Forta contract can call this method
    require(msg.sender == address(fortaContract), "Unauthorized");
    fortaContract.raiseAlert(user);
    msgData;
  }
}
