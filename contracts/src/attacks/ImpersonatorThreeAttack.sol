// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../levels/ImpersonatorThree.sol";

contract ImpersonatorThreeAttack {
    function attack(address _target) public payable {
        ImpersonatorThree instance = ImpersonatorThree(_target);

        // Look at ImpersonatorThree.py, these variables are derived from
        // a = 52430435851564290880884700725761918680810753821852105772089830331399623408749
        // b = 83733105095187201015863515961884166102164088760122321300177194192232762348397
        bytes32 data = hex"aa969ecdd45e07a009b731d7f1d792e0bbd64231034256b86efe8c881122e7bf";
        bytes
            memory signature = hex"1e1aba1dd3b10c6c62b208223c92537a6e3798682218fbbd2f1116a8c3f14b292794414a0e4be61acb925e74cd46a449131b34a0f252144a70ac945c2d6017921b";
        instance.withdraw(data, signature);
    }

    fallback() external payable {}
}
