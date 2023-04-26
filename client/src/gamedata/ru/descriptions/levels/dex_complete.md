Получение цен или любых данных из любого единственного источника является мощным направлением атак в смарт-контрактах.

Из этого примера вы ясно можете видеть, что кто-либо с большим капиталом может одним махом манипулировать ценой и заставить любые приложения, полагающиеся на неё, использовать неправильную цену.

Сама биржа децентрализована, но цена актива централизована, поскольку она исходит от 1 источника — биржи dex. Вот почему нам нужны [oracles](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72?source=friends_link&sk=d921a38466df8a9176ed8dd767d8c77d) ("оракулы"). Оракулы являются инструментами для занесения информации в контракт и получения её оттуда. Нам нужно получать информацию из нескольких независимых децентрализованных источников, чтобы не допустить такой ошибки.

[Chainlink Data Feeds](https://docs.chain.link/docs/get-the-latest-price) (Каналы данных Chainlink) — безопасный, надёжный способ получения децентрализованных данных из смарт контрактов. Они располагают обширной библиотекой из множества различных источников, а также предлагают [надёжную случайную информацию](https://docs.chain.link/docs/chainlink-vrf), возможность сделать [любой API call](https://docs.chain.link/docs/make-a-http-get-request), [создание модульной сети oracle](https://docs.chain.link/docs/architecture-decentralized-model), [автоматизацию действий смарт-контрактов](https://docs.chain.link/docs/kovan-keeper-network-beta), and unlimited customization. 

[Оракулы Uniswap TWAP](https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles) полагаются на взвешенную по времени ценовую модель, называемую [TWAP](https://en.wikipedia.org/wiki/Time-weighted_average_price#). Хотя такой дизайн может показаться привлекательным, этот протокол сильно зависит от ликвидности DEX (децентрализованной биржи), и, если она слишком низкая, ценами можно легко манипулировать.


Вот пример получения данных из канала данных Chainlink (в тестовой сети Sepolia):
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
[Попробуй в IDE Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol)
