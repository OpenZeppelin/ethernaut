Stake is safe for staking native ETH and ERC20 WETH, considering the same 1:1 value of the tokens. Can you drain the contract?

To complete this level, the contract state must meet the following conditions:

* The `Stake` contract's ETH balance has to be greater than 0.
* `totalStaked` must be greater than the `Stake` contract's ETH balance.
* You must be a staker.
* You staked balance must be 0.

Things that might be useful:
* [ERC-20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) specification.
* [OpenZeppelin contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)
