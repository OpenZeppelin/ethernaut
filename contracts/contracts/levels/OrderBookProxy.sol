// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Proxy.sol";

contract OrderBookProxy is Proxy {
    address private _address;

    constructor(address fixedAddress) {
        _address = fixedAddress;
    }

    function _implementation() internal view override returns (address) {
        return _address;
    }
}
