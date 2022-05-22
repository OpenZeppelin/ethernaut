Getting prices from any single source is a massive attack vector in web3 apps.

You can see from this example that anyone could manipulate the price with a flash swap & cause any applications relying on it to use the wrong price.

The exchange itself is decentralized, but the price calculation is centralized since it comes from 1 dex. This is why we need [oracles](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72?source=friends_link&sk=d921a38466df8a9176ed8dd767d8c77d). Oracles are ways to get data into and out of smart contracts.

[Chainlink Data Feeds](https://docs.chain.link/docs/get-the-latest-price) are a secure, reliable, way to get decentralized data into your smart contracts. They have a vast library of many different sources, and also offer [secure randomness](https://docs.chain.link/docs/chainlink-vrf), ability to make [any API call](https://docs.chain.link/docs/make-a-http-get-request), [modular oracle network creation](https://docs.chain.link/docs/architecture-decentralized-model), [upkeep, actions, and maintainance](https://docs.chain.link/docs/kovan-keeper-network-beta), and unlimited customization. 