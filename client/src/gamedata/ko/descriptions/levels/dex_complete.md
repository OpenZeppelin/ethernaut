정수 연산의 문제는 차치하더라도, 단일 소스에서 가격이나 데이터를 받아오는 것은 스마트 컨트렉트에서 매우 위험한 공격 벡터가 될 수 있습니다. 

이번 예시처럼, 자본력이 있는 누군가가 단번에 가격을 조작해 이 가격을 기반으로 작동하는 애플리케이션들을 오작동하게 만들 수 있습니다. 

DEX 자체는 탈중앙화되어 있지만, 자신의 가격은 단일 DEX로부터만 나오므로 중앙화되어 있습니다. 그러나 가상의 자산이 아닌 실제 자산을 나타내는 토큰을 고려한다면, 대부분의 토큰은 여러 DEX 및 네트워크에 페어가 존재할 것입니다. 이렇게 하면 특정 DEX가 이와 같은 공격의 표적이 되는 경우 자산 가격에 미치는 영향이 줄어들 수 있습니다. 

[Oracles](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72?source=friends_link&sk=d921a38466df8a9176ed8dd767d8c77d)은 스마트 컨트랙트에서 데이터를 주고받는 데 사용됩니다. 

[Chainlink Data Feeds](https://docs.chain.link/docs/get-the-latest-price)는 탈중앙화 데이터를 스마트 컨트랙트로 가져오는 안전하고 신뢰할 수 있는 방법입니다. 다양한 소스로 구성된 방대한 라이브러리를 보유하고 있으며, [안전한 무작위성](https://docs.chain.link/docs/chainlink-vrf), [모든 API 호출 기능](https://docs.chain.link/docs/make-a-http-get-request), [모듈식 Oracles 네트워크 생성](https://docs.chain.link/docs/architecture-decentralized-model), [유지, 작업 및 관리](https://docs.chain.link/docs/kovan-keeper-network-beta), 무제한 사용자 지정 기능을 제공합니다. 

[Uniswap TWAP Oracles](https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles)은 [TWAP](https://en.wikipedia.org/wiki/Time-weighted_average_price#)이라는 시간 가중 가격 모델을 사용합니다. 설계는 매력적일 수 있지만 이 프로토콜은 DEX 프로토콜의 유동성에 크게 의존하며, 유동성이 너무 낮으면 가격이 쉽게 조작될 수 있습니다. 

다음은 Chainlink Data feed(Sepolia 테스트넷)에서 비트코인 가격을 USD로 가져오는 예시입니다: 

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
[Remix에서 사용해 보세요.](https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol)

[Chainlink feed page](https://data.chain.link/ethereum/mainnet/crypto-usd/btc-usd)에서 최대 31개의 다른 출처에서 비트코인 가격이 조회되는 것을 확인할 수 있습니다. 

모든 [Chainlink feed 가격 주소 list](https://docs.chain.link/data-feeds/price-feeds/addresses/)도 확인할 수 있습니다.