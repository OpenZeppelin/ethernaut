pragma solidity ^0.5.0;

import "./stamp/IStampCollector.sol";
import "./stamp/NotStamp.sol";
import "./stamp/Stamp.sol";


contract StampCollectorValidator {
  bool public p1;
  bool public p2;
  bool public caught;
  
  function submitContract(address submission) public returns (bool){
    address stamp = address(new Stamp("0x11", 10));
    address notStamp = address(new NotStamp("0x10", 10));
    
    // solium-disable-next-line security/no-low-level-calls
    (bool canCollectStamp, ) = address(submission).call(abi.encodeWithSignature("collectStamp(address)", stamp));
    
    // solium-disable-next-line security/no-low-level-calls
    (bool canCollectNotStamp, ) = address(submission).call(abi.encodeWithSignature("collectStamp(address)", notStamp));
    
    IStampCollector trainer = IStampCollector(submission);
    bool stampIsCollected = trainer.isCollected(stamp);
    bool notStampIsCollected = trainer.isCollected(notStamp);
    
    if(canCollectStamp && !canCollectNotStamp && stampIsCollected && !notStampIsCollected){
      caught = true;
    }
  }
}