pragma solidity ^0.4.24;

contract Shuttle {
  bool public launched;
  bytes32 private launchCode_encr;

  // modifier gate(){
  //   require(msg.sender != tx.origin);
  //   _;
  // }
  
  constructor (bytes32 _launchCode) public {
    launched = false;
    launchCode_encr = _launchCode;
  }

  // function launch(bytes32 _launchCode) gate public {
  //   if (launchCode_encr == (_launchCode ^ bytes32(block.number))) {
  //       launched = true;
  //   }
  // }


  function launch(bytes32 _launchCode) public {
    if (launchCode_encr == _launchCode) {
        launched = true;
    }
  }
}