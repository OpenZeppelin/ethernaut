为了防止转移资产时的重入攻击, 使用 [Checks-Effects-Interactions pattern](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern) 注意  `call` 只会返回 false 而不中断执行流. 其它方案比如 [ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard) 或 [PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment) 也可以使用.

`transfer` 和 `send` 不再被推荐使用, 因为他们在 Istanbul 硬分叉之后可能破坏合约 [Source 1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/) [Source 2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742).

总是假设资产的接受方可能是另一个合约, 而不是一个普通的地址. 因此, 他有可能执行了他的payable fallback 之后又“重新进入” 你的合约, 这可能会打乱你的状态或是逻辑.

重进入是一种常见的攻击. 你得随时准备好!

&nbsp;
#### The DAO Hack

著名的DAO hack 使用了重进入攻击, 窃取了受害者大量的 ether. 参见 [15 lines of code that could have prevented TheDAO Hack](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942).
