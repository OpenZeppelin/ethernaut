Dejando a un lado la parte matemática, obtener precios o cualquier tipo de datos de una sola fuente es un vector de ataque masivo en los contratos inteligentes.

Puedes ver claramente en este ejemplo que alguien con mucho capital podría manipular el precio de una sola vez y hacer que cualquier aplicación que dependa de él use el precio incorrecto.

El exchange en sí está descentralizado, pero el precio del activo está centralizado, ya que proviene de 1 dex. Sin embargo, si consideramos tokens que representan activos reales en lugar de ficticios, la mayoría tendría pares de intercambio en varias dex y diferentes redes. Esto reduciría el impacto en el precio del activo en caso de que una dex específica sufriera un ataque de este tipo.


Los [oráculos](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72?source=friends_link&sk=d921a38466df8a9176ed8dd767d8c77d) son formas de introducir y extraer datos de los contratos inteligentes.

[Chainlink Data Feeds](https://docs.chain.link/docs/get-the-latest-price) es una forma segura y confiable de obtener datos descentralizados en los contratos inteligentes. Tienen una amplia biblioteca de muchas fuentes diferentes, y también ofrecen [secure randomness](https://docs.chain.link/docs/chainlink-vrf), capacidad para realizar [cualquier llamada API](https://docs.chain.link/docs/make-a-http-get-request), [modular oracle network creation](https://docs.chain.link/docs/architecture-decentralized-model), [upkeep, actions, and maintainance](https://docs.chain.link/docs/kovan-keeper-network-beta) y personalización ilimitada.

[Uniswap TWAP Oracles](https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles) se basa en un modelo de precio ponderado por tiempo llamado [TWAP](https://en.wikipedia.org/wiki/Time-weighted_average_price#). Si bien el diseño puede ser atractivo, este protocolo depende en gran medida de la liquidez del protocolo DEX y, si es demasiado bajo, los precios se pueden manipular fácilmente.

A continuación, se muestra un ejemplo de cómo obtener el precio de Bitcoin en USD de un feed de datos de Chainlink (en la red de prueba de Sepolia):
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
[Prueba en Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol)

Comprueba en la [página](https://data.chain.link/ethereum/mainnet/crypto-usd/btc-usd) del feed cómo se consulta el precio en hasta 31 fuentes diferentes.

También puedes comprobar la [lista](https://docs.chain.link/data-feeds/price-feeds/addresses/) de todos los feeds de precios de Chainlink.