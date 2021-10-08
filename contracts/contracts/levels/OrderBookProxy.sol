// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/proxy/Proxy.sol";

contract OrderBookProxy is Proxy {

  address private _address;

  constructor(address fixedAddress) public {
    _address = fixedAddress;
  }

  function _implementation() internal override view returns(address){
    return _address;
  }

}