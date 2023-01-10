Dejando a un lado la parte matemática, obtener precios o cualquier tipo de datos de una sola fuente es un vector de ataque masivo en los contratos inteligentes.

Puedes ver claramente en este ejemplo que alguien con mucho capital podría manipular el precio de una sola vez y hacer que cualquier aplicación que dependa de él use el precio incorrecto.

El exchange en sí está descentralizado, pero el precio del activo está centralizado, ya que proviene de 1 dex. Es por eso que necesitamos [oráculos](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72?source=friends_link&sk=d921a38466df8a9176ed8dd767d8c77d). Los oráculos son formas de introducir y extraer datos de los contratos inteligentes. Deberíamos siempre obtener nuestros datos de múltiples fuentes descentralizadas independientes, de lo contrario, podemos correr este riesgo.

[Chainlink Data Feeds](https://docs.chain.link/docs/get-the-latest-price) es una forma segura y confiable de obtener datos descentralizados en los contratos inteligentes. Tienen una amplia biblioteca de muchas fuentes diferentes, y también ofrecen [secure randomness](https://docs.chain.link/docs/chainlink-vrf), capacidad para realizar [cualquier llamada API](https://docs.chain.link/docs/make-a-http-get-request), [modular oracle network creation](https://docs.chain.link/docs/architecture-decentralized-model), [upkeep, actions, and maintainance](https://docs.chain.link/docs/kovan-keeper-network-beta) y personalización ilimitada.

[Uniswap TWAP Oracles](https://uniswap.org/docs/v2/core-concepts/oracles/) se basa en un modelo de precio ponderado por tiempo llamado [TWAP] (https://en.wikipedia.org/wiki/Time-weighted_average_price#). Si bien el diseño puede ser atractivo, este protocolo depende en gran medida de la liquidez del protocolo DEX y, si es demasiado bajo, los precios se pueden manipular fácilmente.

A continuación, se muestra un ejemplo de cómo obtener datos de un feed de datos de Chainlink (en la red de prueba de kovan):
```

pragma solidity ^0.6.7;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     */
    constructor() public {
        priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }
}
```
[Prueba en Remix](https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=0c5928a00094810d2ba01fd8d1083581)
