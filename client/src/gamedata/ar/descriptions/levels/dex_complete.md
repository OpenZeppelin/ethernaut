بغض النظر عن جزء الرياضيات الصحيحة، فإن الحصول على الأسعار أو أي نوع من البيانات من أي مصدر واحد يمثل ثغرة هجوم هائلة في العقود الذكية.

يمكنك أن ترى بوضوح من خلال هذا المثال، أن شخصاً يمتلك رأساً مالياً كبيراً يمكنه التلاعب بالسعر بضربة واحدة، مما يؤدي إلى جعل أي تطبيقات تعتمد على هذا السعر تستخدم سعراً خاطئاً.

البورصة نفسها لا مركزية، لكن سعر الأصل مركزي لأنه يأتي من منصة تداول لا مركزية  واحدة. ومع ذلك، إذا نظرنا إلى الرموز التي تمثل أصولاً حقيقية بدلاً من الأصول الوهمية، فإن معظمها يمتلك أزواج تداول في منصات وشبكات متعددة. من شأن ذلك أن يقلل الأثر على سعر الأصل في حال تم استهداف منصة تداول معينة بهجوم كهذا.

تُستخدم [الأوراكل (Oracle)](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72?source=friends_link&sk=d921a38466df8a9176ed8dd767d8c77d) لإدخال البيانات إلى العقود الذكية وإخراجها منها.

تُعد [Chainlink Data Feeds](https://docs.chain.link/docs/get-the-latest-price) وسيلة آمنة وموثوقة لإدخال البيانات اللامركزية إلى عقودك الذكية. فهي تمتلك مكتبة ضخمة من مصادر مختلفة ومتنوعة، كما توفر أيضاً [العشوائية الآمنة](https://docs.chain.link/docs/chainlink-vrf)، والقدرة على إجراء [أي استدعاء لواجهة برمجة تطبيقات (API call)](https://docs.chain.link/docs/make-a-http-get-request)، و[إنشاء شبكة أوراكل نمطية](https://docs.chain.link/docs/architecture-decentralized-model)، و[الاستمرارية والإجراءات والصيانة](https://docs.chain.link/docs/kovan-keeper-network-beta)، وتخصيصاً غير محدود.

تعتمد [Uniswap TWAP Oracles](https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles) على نموذج سعر مرجح زمنياً يُسمى [TWAP](https://en.wikipedia.org/wiki/Time-weighted_average_price#). ورغم أن التصميم قد يكون جذاباً، إلا أن هذا البروتوكول يعتمد بشكل كبير على السيولة في بروتوكول منصة التداول اللامركزية (DEX)، وإذا كانت هذه السيولة منخفضة للغاية، فيمكن التلاعب بالأسعار بسهولة.

هنا مثال على الحصول على سعر البيتكوين بالدولار الأمريكي من Chainlink Data Feeds (على شبكة الاختبار "Sepolia"):

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
            /*uint256 startedAt*/,
            /*uint256 timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }
}
```
[جربه على Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol)

راجع [صفحة](https://data.chain.link/ethereum/mainnet/crypto-usd/btc-usd) Chainlink feed لمعرفة أن سعر البيتكوين يتم الاستعلام عنه من ما يصل إلى 31 مصدرًا مختلفًا.

يمكنك التحقق أيضًا من [قائمة](https://docs.chain.link/data-feeds/price-feeds/addresses/) جميع عناوين خلاصات أسعار Chainlink.

