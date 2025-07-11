// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../levels/ImpersonatorTwo.sol";

contract ImpersonatorTwoAttack {
    function attack(address _target) public payable {
        ImpersonatorTwo instance = ImpersonatorTwo(_target);

        bytes
            memory lock_sig = hex"4f746c6e2c44df1a99153d9fafa5ec954cc0be31e0af8e4f3a4efa4a9bf6007a6d644dbb2de6a98c442176d5b712759c43da86e0a6b05837c1fb4346e20f9ae61c";
        instance.switchLock(lock_sig);

        bytes
            memory admin_sig = hex"4d840e91463f5bb49176d98aa54c045443e44e3cb7f7dfd4ba35fa16517d637f10b8881f1777b793a086049e4c413553954be9781430b02702c9c9ec3b9287c61b";
        instance.setAdmin(admin_sig, address(this));
        instance.withdraw();
    }

    fallback() external payable {}
}
