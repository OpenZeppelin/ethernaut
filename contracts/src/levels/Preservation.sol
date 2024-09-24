// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Preservation {
    // public library contracts
    LibraryContract public timeZone1Library;
    LibraryContract public timeZone2Library;
    address public owner;
    uint256 storedTime;
    // Sets the function signature for delegatecall
    bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));

    constructor(LibraryContract _timeZone1LibraryContract, LibraryContract _timeZone2LibraryContract) {
        timeZone1Library = _timeZone1LibraryContract;
        timeZone2Library = _timeZone2LibraryContract;
        owner = msg.sender;
    }

    // set the time for timezone 1
    function setFirstTime(uint256 _timeStamp) public {
        (bool success, ) = address(timeZone1Library).delegatecall(abi.encodePacked(setTimeSignature, _timeStamp));
        require(success);
    }

    // set the time for timezone 2
    function setSecondTime(uint256 _timeStamp) public {
        (bool success, ) = address(timeZone2Library).delegatecall(abi.encodePacked(setTimeSignature, _timeStamp));
        require(success);
    }
}

// Simple library contract to set the time
contract LibraryContract {
    // stores a timestamp
    uint256 storedTime;

    function setTime(uint256 _time) public {
        storedTime = _time;
    }
}
