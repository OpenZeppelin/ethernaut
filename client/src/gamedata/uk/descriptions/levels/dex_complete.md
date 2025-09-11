За виключенням частини, що стосується цілочисельної математики, отримання цін або будь-яких даних від будь-якого єдиного джерела є великим вектором атаки в розумних контрактах.

Ви ясно бачите з цього прикладу, що людина з великим капіталом може маніпулювати ціною одним рухом, що призведе до того, що всі застосунки, що використовують ціну, будуть використовувати неправильну ціну.

Обмін сам по собі є децентралізованим, але ціна активу є централізованою, оскільки вона походить з одного dex. Однак, якщо ми розглядатимемо токени, що представляють справжні активи, а не вигадані, більшість з них матимуть пари обміну на декількох dexes і мережах. Це зменшить вплив на ціну активу у разі специфічного dex, який став мішенню для такої атаки.

[Оракули](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72?source=friends_link&sk=d921a38466df8a9176ed8dd767d8c77d) використовуються для отримання даних в розумні контракти і з них.

[Chainlink Data Feeds](https://docs.chain.link/docs/get-the-latest-price) - це безпечний, надійний спосіб отримати децентралізовані дані в ваших розумних контрактах. Вони мають велику бібліотеку з багатьма різними джерелами, а також пропонують [безпечний випадковий](https://docs.chain.link/docs/chainlink-vrf), можливість робити [будь-який API виклик](https://docs.chain.link/docs/make-a-http-get-request), [створення модульної мережі оракулів](https://docs.chain.link/docs/architecture-decentralized-model), [технічне обслуговування, дії та обслуговування](https://docs.chain.link/docs/kovan-keeper-network-beta), та необмежене налаштування.

[Uniswap TWAP Oracles](https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles) покладаються на модель вагової ціни в часі, відому як [TWAP](https://en.wikipedia.org/wiki/Time-weighted_average_price#). Хоча дизайн може бути привабливим, цей протокол сильно залежить від ліквідності протоколу DEX, і якщо вона дуже низька, ціни можна легко маніпулювати.


Ось приклад отримання ціни на Bitcoin в USD з каналу даних Chainlink (на тестовій мережі Sepolia):

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {
    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Sepolia
     * Aggregator: BTC/USD
     * Address: 0

x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
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
[Спробуйте на Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol)

Перевірте сторінку з каналом даних Chainlink [тут](https://data.chain.link/ethereum/mainnet/crypto-usd/btc-usd), щоб побачити, що ціна на Bitcoin запитується з до 31 різного джерела.

Ви також можете перевірити [список](https://docs.chain.link/data-feeds/price-feeds/addresses/) всіх адрес каналів даних Chainlink.
