// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// import all the abi's required to deploy
import {Ownable} from "openzeppelin-contracts-08/access/Ownable.sol";
import {Ethernaut} from "../Ethernaut.sol";
import {Statistics} from "../metrics/Statistics.sol";
import {ProxyStats} from "../proxy/ProxyStats.sol";
import {ProxyAdmin} from "../proxy/ProxyAdmin.sol";
import {Level} from "../levels/base/Level.sol";

// deploy all the necessary contract in steps
contract Factory is Ownable {
    Ethernaut public ethernaut;
    ProxyAdmin public proxyAdmin;
    Statistics public implementation;
    ProxyStats public proxyStats;

    constructor() {
        // deploy the four core contracts
        ethernaut = new Ethernaut();
        proxyAdmin = new ProxyAdmin();
        implementation = new Statistics();
        proxyStats = new ProxyStats(
            address(implementation),
            address(proxyAdmin),
            address(ethernaut)
        );
        // initialise the ethernaut contract with the proxystats method
        ethernaut.setStatistics(address(proxyStats));
        // here is where statistics seats behind the proxy
        implementation = Statistics(address(proxyStats));
    }

    // use this function to register a level since this address is the owner of ethernaut
    function registerLevel(Level _level) public onlyOwner {
        ethernaut.registerLevel(_level);
    }

    // use this function to transfer the ownership of the ethernaut contract to a new user(ethernaut?)
    function transferContractsOwnership(address _newOwner) public onlyOwner {
        ethernaut.transferOwnership(_newOwner);
        proxyAdmin.transferOwnership(_newOwner);
        transferOwnership(_newOwner);
    }
}
