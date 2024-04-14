Congratulations, you have cracked the `Stake` machine!

When performing low-level calls to external contracts, it is important to properly validate external call returns to determine whether the call reverted.

For more info, check out [EEA EthTrust [S] Check External Calls Return](https://entethalliance.github.io/eta-registry/security-levels-spec.html#req-1-check-return) requirement, and always use [SafeERC20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/utils/SafeERC20.sol) when interacting with external ERC-20 tokens.