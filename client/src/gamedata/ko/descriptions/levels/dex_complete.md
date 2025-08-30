정수 계산은 차치하더라도, 단일 소스에서 가격이나 다른 종류의 데이터를 가져오는 것은 스마트 컨트랙트에서 거대한 공격 벡터(attack vector)가 됩니다.

이 예제에서 명확히 알 수 있듯이, 막대한 자본을 가진 누군가가 단번에 가격을 조작하여, 이에 의존하는 모든 애플리케이션이 잘못된 가격을 사용하도록 만들 수 있습니다.

거래소 자체는 탈중앙화되어 있지만, 자산 가격은 하나의 DEX에서 오기 때문에 중앙화되어 있습니다. 이것이 바로 [오라클(oracles)](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72?source=friends_link&sk=d921a38466df8a9176ed8dd767d8c77d)이 필요한 이유입니다. 오라클은 스마트 컨트랙트 안팎으로 데이터를 가져오는 방법입니다. 데이터는 여러 독립적이고 분산된 소스에서 가져와야 하며, 그렇지 않으면 이와 같은 위험에 노출됩니다.

[Chainlink 데이터 피드(Data Feeds)](https://docs.chain.link/docs/get-the-latest-price)는 탈중앙화된 데이터를 스마트 컨트랙트로 가져오는 안전하고 신뢰할 수 있는 방법입니다. 다양한 소스로 구성된 방대한 라이브러리를 갖추고 있으며, [안전한 무작위성(secure randomness)](https://docs.chain.link/docs/chainlink-vrf), [모든 API 호출(any API call)](https://docs.chain.link/docs/make-a-http-get-request), [모듈형 오라클 네트워크 생성(modular oracle network creation)](https://docs.chain.link/docs/architecture-decentralized-model), [유지보수 및 작업(upkeep, actions, and maintenance)](https://docs.chain.link/docs/kovan-keeper-network-beta) 등 무한한 사용자 정의 기능을 제공합니다.

[Uniswap TWAP 오라클](https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles)은 [TWAP](https://en.wikipedia.org/wiki/Time-weighted_average_price#)이라고 불리는 시간 가중 평균 가격(time-weighted average price) 모델에 의존합니다. 이 디자인은 매력적일 수 있지만, 이 프로토콜은 DEX 프로토콜의 유동성에 크게 의존하므로 유동성이 너무 낮으면 가격이 쉽게 조작될 수 있습니다.

다음은 Chainlink 데이터 피드에서 BTC/USD 가격을 가져오는 예제입니다 (Sepolia 테스트넷 기준):

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

[Remix에서 실행해보기](https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol)
