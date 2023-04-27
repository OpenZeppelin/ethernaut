整数計算の部分はさておき、価格やあらゆる種類のデータを単一のソースから取得することは、スマートコントラクトにおける大きな攻撃の要素となります。

この例からも明らかなように、大量の資本を持つ人が一挙に価格を操作し、それに依存するアプリケーションが間違った価格を使用することになるのです。

取引所自体は分散化されていますが、資産の価格は 1 dex から来ているので、中央集権的です。これが、[oracles](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72?source=friends_link&sk=d921a38466df8a9176ed8dd767d8c77d)が必要な理由です。オラクルとは、スマートコントラクトにデータを出し入れする方法です。複数の独立した分散型ソースからデータを取得するべきで、そうしないとこのようなリスクがあります。

[Chainlink Data Feeds](https://docs.chain.link/docs/get-the-latest-price)は、分散型データをスマートコントラクトに取り込むための、安全で信頼できる方法です。多くの異なるソースからなる膨大なライブラリを持ち、[安全なランダム性](https://docs.chain.link/docs/chainlink-vrf)、[任意の API コール](https://docs.chain.link/docs/make-a-http-get-request)、[モジュラーオラクルネットワークの作成](https://docs.chain.link/docs/architecture-decentralized-model)、[アップキープ、アクション、メンテナンス](https://docs.chain.link/docs/kovan-keeper-network-beta)、そして自由なカスタマイズも可能です。

[Uniswap TWAP Oracles](https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles)は、[TWAP](https://en.wikipedia.org/wiki/Time-weighted_average_price#)と呼ばれる時間加重価格モデルに依存しています。魅力的なデザインではありますが、このプロトコルは DEX プロトコルの流動性に大きく依存しており、流動性が低すぎると価格が簡単に操作されてしまいます。

ここでは、Chainlink のデータフィードからデータを取得する例を紹介します（Sepolia testnet）:

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

[Try it on Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol)
