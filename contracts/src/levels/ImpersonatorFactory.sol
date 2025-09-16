// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./Impersonator.sol";

contract ImpersonatorFactory is Level {
    function createInstance(address _player) public payable override returns (address) {
        _player;
        Impersonator impersonator = new Impersonator(1336);
        bytes memory signature = abi.encode(
            [
                uint256(11397568185806560130291530949248708355673262872727946990834312389557386886033),
                uint256(54405834204020870944342294544757609285398723182661749830189277079337680158706),
                uint256(27)                             
            ] 
        );
        impersonator.deployNewLock(signature);
        return address(impersonator);
    }

    function validateInstance(address payable _instance, address _player) public view override returns (bool) {
        _player;
        Impersonator instance = Impersonator(_instance);
        ECLocker locker = instance.lockers(0);
        return locker.controller() == address(0);
    }
}
