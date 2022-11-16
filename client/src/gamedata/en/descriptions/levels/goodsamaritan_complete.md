Congratulations! You have completed the final level (for now). 

Custom errors in Solidity are identified by their 4-byte signature, the same as a function call. They are bubbled up through the call chain until they are caught by a catch statement in a try-catch block, as seen in the GoodSamaritan's `requestDonation()` function. For these reasons, it is not safe to assume that the error was thrown by the immediate target of the contract call (i.e., Wallet in this case). Any other contract further down in the call chain can declare the same error--which will have the same signature--and throw it at an unexpected location, such as in the `notify(uint256 amount)` function in your attacker contract.

If this is the end of your journey here, and you've completed all the previous levels, pat yourself on the back--you are officially a master Ethernaut!

Check back again in a little while, as new Ethernaut levels are always being proposed in our [Github repo](https://github.com/OpenZeppelin/ethernaut). If you have an idea yourself for a new level, that's the place to make a proposal!
