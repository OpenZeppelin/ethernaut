Bỏ qua phần toán học số nguyên, việc lấy giá hoặc bất kỳ loại dữ liệu nào từ một nguồn duy nhất là một vector tấn công lớn trong hợp đồng thông minh.

Bạn có thể thấy rõ từ ví dụ này, rằng ai đó có nhiều vốn có thể thao túng giá trong một cú đánh, và khiến bất kỳ ứng dụng nào dựa vào nó sử dụng giá sai.

Bản thân sàn giao dịch là phi tập trung, nhưng giá của tài sản lại tập trung, vì nó đến từ 1 dex. Tuy nhiên, nếu chúng ta xem xét các token đại diện cho tài sản thực tế thay vì tài sản hư cấu, hầu hết chúng sẽ có các cặp trao đổi trong nhiều dex và mạng. Điều này sẽ giảm tác động đến giá tài sản trong trường hợp một dex cụ thể bị tấn công như vậy.

[Oracles](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72?source=friends_link&sk=d921a38466df8a9176ed8dd767d8c77d) được sử dụng để lấy dữ liệu vào và ra khỏi hợp đồng thông minh.

[Chainlink Data Feeds](https://docs.chain.link/docs/get-the-latest-price) là một cách an toàn, đáng tin cậy để lấy dữ liệu phi tập trung vào hợp đồng thông minh của bạn. Chúng có một thư viện rộng lớn với nhiều nguồn khác nhau, và cũng cung cấp [tính ngẫu nhiên an toàn](https://docs.chain.link/docs/chainlink-vrf), khả năng thực hiện [bất kỳ lệnh gọi API nào](https://docs.chain.link/docs/make-a-http-get-request), [tạo mạng oracle mô-đun](https://docs.chain.link/docs/architecture-decentralized-model), [bảo trì, hành động và duy trì](https://docs.chain.link/docs/kovan-keeper-network-beta), và tùy chỉnh không giới hạn.

[Uniswap TWAP Oracles](https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles) dựa vào mô hình giá trọng số thời gian gọi là [TWAP](https://en.wikipedia.org/wiki/Time-weighted_average_price#). Mặc dù thiết kế có thể hấp dẫn, giao thức này phụ thuộc nhiều vào tính thanh khoản của giao thức DEX, và nếu điều này quá thấp, giá có thể dễ dàng bị thao túng. 


Đây là một ví dụ về việc lấy giá Bitcoin bằng USD từ Chainlink data feed (trên Sepolia testnet):

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
[Thử trên Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol)

Kiểm tra [trang](https://data.chain.link/ethereum/mainnet/crypto-usd/btc-usd) Chainlink feed để xem rằng giá Bitcoin được truy vấn từ tối đa 31 nguồn khác nhau.

Bạn cũng có thể kiểm tra [danh sách](https://docs.chain.link/data-feeds/price-feeds/addresses/) tất cả địa chỉ Chainlink price feeds.

