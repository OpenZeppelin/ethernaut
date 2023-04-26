除了整数数学部分，从任何单一来源获取价格或任何类型的数据是智能合约中的一个大规模攻击向量。

从这个例子中你可以清楚地看到，拥有大量资金的人可以一举操纵价格，导致任何依赖它的应用程序使用错误的价格。

交易所本身是去中​​心化的，但资产的价格是中心化的，因为它来自 1 dex。这就是我们需要预言机的原因。预言机是将数据输入和输出智能合约的方法。我们应该从多个独立的去中心化来源获取数据，否则我们可能会冒这个风险。

Chainlink 数据馈送是一种安全、可靠的方式，可以将去中心化数据导入您的智能合约。他们拥有一个包含许多不同来源的庞大库，还提供安全的随机性、进行任何 API 调用的能力、模块化的预言机网络创建、维护、操作和维护，以及无限的定制。

Uniswap TWAP 预言机依赖于称为 TWAP 的时间加权价格模型。虽然设计很有吸引力，但该协议在很大程度上取决于 DEX 协议的流动性，如果流动性太低，价格很容易被操纵。

以下是从 Chainlink 数据源（在 Sepolia 测试网上）获取数据的示例：

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {
    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Sepolia
     * Aggregator: BTC/USD
     * Address: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
     */
    constructor() {
        priceFeed = AggregatorV3Interface(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        );
    }

    /**
     * Returns the latest price.
     */
    function getLatestPrice() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }
}

```

[尝试在 Remix 上](https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol)