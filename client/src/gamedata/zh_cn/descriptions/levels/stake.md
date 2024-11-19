考虑到代币的 1:1 价值，Stake 适合用于质押原生 ETH 和 ERC20 WETH。你能抽干合约吗？

要完成这一关，合约状态必须满足以下条件：

- `Stake` 合约的 ETH 余额必须大于 0。
- `totalStaked` 必须大于 `Stake` 合约的 ETH 余额。
- 你必须是一个质押者。
- 你的质押余额必须为 0。

可能有用的东西：

- [ERC-20](https://github.com/ethereum/ercs/blob/master/ERCS/erc-20.md) 规范。
- [OpenZeppelin 合约](https://github.com/OpenZeppelin/openzeppelin-contracts)