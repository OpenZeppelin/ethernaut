// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract StatsProxy2 is TransparentUpgradeableProxy {
    constructor(address _impl, address _admin)
        TransparentUpgradeableProxy(_impl, _admin, "")
    {}
}
