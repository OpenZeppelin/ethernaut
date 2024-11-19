恭喜你，破解了 `Stake` 机器！

在对外部合约进行低级调用时，正确验证外部调用返回值以确定调用是否回退非常重要。

有关更多信息，请查看 [EEA EthTrust [S] 检查外部调用返回](https://entethalliance.github.io/eta-registry/security-levels-spec.html#req-1-check-return) 要求，并在与外部 ERC-20 代币交互时始终使用 [SafeERC20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/utils/SafeERC20.sol)。