本关特色是名为 `CryptoVault` 的特殊功能， 即 `sweepToken` 函数。 这是用于检索卡在合约中的代币的常用函数。 `CryptoVault` 使用无法清除的底层代币(`underlying`)运行，因为它是 `CryptoVault` 的重要核心逻辑组件， 可以清除任何其他令牌。

底层代币是在 `DoubleEntryPoint` 合约定义中实现的 DET 代币实例，`CryptoVault` 拥有 100 个单位。 此外，`CryptoVault` 还持有 100 个 `LegacyToken LGT`。

在本关中，您应该找出 `CryptoVault` 中的错误位置，并保护它不被耗尽代币。

该合约继承有一个 `Forta` 合约，任何用户都可以在其中注册自己的检测机器人(`detection bot`)合约。 Forta 是一个去中心化的、基于社区的监控网络，用于尽快检测 DeFi、NFT、治理代币、区块链桥以及其他 Web3 系统上的威胁和异常。 您的工作是设计一个检测机器人(`detection bot`)并将其注册到 `Forta` 合约中。 机器人的需要发出正确的警报(alerts)，以防止潜在的攻击或漏洞利用。

可能有帮助的事情：

- 代币合约的双入口是如何运行的？