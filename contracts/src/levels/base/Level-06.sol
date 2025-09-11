// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "openzeppelin-contracts-06/access/Ownable.sol";

abstract contract Level is Ownable {
    function createInstance(address _player) public payable virtual returns (address);
    function validateInstance(address payable _instance, address _player) public virtual returns (bool);
}
