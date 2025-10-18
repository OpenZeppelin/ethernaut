Tam sayı matematiğini bir kenara bırakacak olursak, herhangi bir kaynaktan fiyat veya veri almak, akıllı sözleşmeler için devasa bir saldırı vektörü oluşturur. 

Bu örnekten de görebileceğiniz gibi, çok sermayesi olan biri fiyatı tek hamlede manipüle edebilir ve buna bağlı çalışan tüm uygulamalar yanlış fiyat kullanabilir.

Borsa kendi başına merkeziyetsiz olsa da, varlığın fiyatı merkezidir çünkü tek bir DEX’ten gelir. Ancak, gerçek varlıkları temsil eden token’lar söz konusu olduğunda, çoğu token birden fazla DEX ve ağda işlem çiftine sahiptir. Bu durum, spesifik bir DEX hedef alındığında varlık fiyatı üzerindeki etkiyi azaltır.

[Oracle'lar](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72?source=friends_link&sk=d921a38466df8a9176ed8dd767d8c77d) akıllı sözleşmelere veri girişi ve çıkışı sağlamak için kullanılır.

[Chainlink Data Feeds](https://docs.chain.link/docs/get-the-latest-price) merkeziyetsiz verileri akıllı sözleşmelerinize taşımak için kullanılan güvenli ve güvenilir bir yoldur. Çok çeşitli kaynaklardan veri alabilir, [güvenli rastgelelik](https://docs.chain.link/docs/chainlink-vrf), [herhangi bir API çağrısı](https://docs.chain.link/docs/make-a-http-get-request) yapabilme, [modüler oracle ağı oluşturma](https://docs.chain.link/docs/architecture-decentralized-model), [bakım/izleme (upkeep), eylemler ve yönetim imkanları](https://docs.chain.link/docs/kovan-keeper-network-beta) ile sınırsız özelleştirme olanağı da sunar.

[Uniswap TWAP Oracles](https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles) ise zaman ağırlıklı ortalama fiyat [TWAP](https://en.wikipedia.org/wiki/Time-weighted_average_price#) modeline dayanır. Bu tasarım cazip olabilir, ancak protokol büyük ölçüde DEX likiditesine bağımlıdır; likidite düşükse fiyatlar kolayca manipüle edilebilir.

Aşağıda, Sepolia testnet üzerinde Chainlink veri kaynağından Bitcoin’in USD fiyatını alma örneği bulunuyor:

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
[Remix'te dene](https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol)

Chainlink veri kaynağı [sayfasını](https://data.chain.link/ethereum/mainnet/crypto-usd/btc-usd) kontrol ederek Bitcoin fiyatının 31 farklı kaynaktan sorgulandığını görebilirsiniz.

Ayrıca, tüm Chainlink fiyat beslemelerinin adreslerinin [listesini](https://docs.chain.link/data-feeds/price-feeds/addresses/) de inceleyebilirsiniz.

