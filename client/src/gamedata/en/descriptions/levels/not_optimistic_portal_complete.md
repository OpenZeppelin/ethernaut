Complexity is the enemy of security.

You successfully exploited the "Impossible Loop" by finding the cracks in the implementation.

The Off-By-One Bug: By failing to hash the last element of the array, the contract allowed you to submit a payload (the block submission) that was executed but never verified against the Merkle proof.

Selector Collision: You bypassed the "selector gate" by finding a collision (0x3a69197e) that looked like a valid message handler but was actually an ownership transfer.

CEI Violation: Because the contract executed calls before verifying proofs, you were able to re-enter the contract and update the state root during the transaction, making your forged proof valid by the time the check occurred.

This challenge highlights why "Checks-Effects-Interactions" is non-negotiable. Always update your state and perform your checks before making external calls.
