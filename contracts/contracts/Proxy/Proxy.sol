// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract ProxyStats is TransparentUpgradeableProxy {
    constructor(
        address _impl,
        address _admin,
        address _ethernautAddress
    )
        TransparentUpgradeableProxy(
            _impl,
            _admin,
            abi.encodeWithSignature("initialize(address)", _ethernautAddress)
        )
    {}
}
