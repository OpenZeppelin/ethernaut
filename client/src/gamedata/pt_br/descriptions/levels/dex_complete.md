Deixando de lado a parte de matemática inteira, obter preços ou qualquer tipo de dados de qualquer fonte única é um vetor de ataque massivo em contratos inteligentes.

Você pode ver claramente neste exemplo que alguém com muito capital poderia manipular o preço de uma só vez e fazer com que qualquer aplicação que dependa dele use o preço errado.

A exchange em si é descentralizada, mas o preço do ativo é centralizado, pois vem de uma DEX. É por isso que precisamos de [oráculos](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72?source=friends_link&sk=d921a38466df8a9176ed8dd767d8c77d). Os oráculos são formas de obter e retirar dados de contratos inteligentes. Devemos obter nossos dados de várias fontes descentralizadas independentes, caso contrário, podemos correr esse risco.

[Chainlink Data Feeds](https://docs.chain.link/data-feeds/using-data-feeds) são uma maneira segura e confiável de obter dados descentralizados em seus contratos inteligentes. Eles têm uma vasta biblioteca de muitas fontes diferentes e também oferecem [aleatoriedade segura](https://docs.chain.link/vrf/v2/introduction), capacidade de fazer [qualquer chamada de API](https://docs.chain.link/any-api/get-request/introduction), [criação modular de rede oracle](https://docs.chain.link/architecture-overview/architecture-decentralized-model) e personalização ilimitada.

[Uniswap TWAP Oracles](https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles) depende de um modelo de preço ponderado no tempo chamado [TWAP](https://en.wikipedia.org/wiki/Time-weighted_average_price#). Embora o design possa ser atraente, esse protocolo depende muito da liquidez do protocolo da DEX e, se for muito baixo, os preços podem ser facilmente manipulados.


Aqui está um exemplo de obtenção de dados de um feed de dados Chainlink (no Sepolia testnet):
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

[Experimente no Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol)