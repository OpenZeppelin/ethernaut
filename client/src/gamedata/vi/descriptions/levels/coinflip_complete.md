Tạo số ngẫu nhiên trong solidity có thể khó khăn. Hiện tại không có cách bản địa để tạo chúng, và mọi thứ bạn sử dụng trong hợp đồng thông minh đều có thể nhìn thấy công khai, bao gồm các biến cục bộ và biến trạng thái được đánh dấu là private. Các thợ mỏ cũng có quyền kiểm soát những thứ như blockhashes, timestamps, và việc có bao gồm các giao dịch nhất định hay không - điều này cho phép họ thiên vị các giá trị này có lợi cho họ.

Để có được số ngẫu nhiên được chứng minh bằng mật mã, bạn có thể sử dụng [Chainlink VRF](https://docs.chain.link/docs/get-a-random-number), sử dụng oracle, token LINK, và hợp đồng on-chain để xác minh rằng số đó thực sự ngẫu nhiên.

Một số tùy chọn khác bao gồm sử dụng Bitcoin block headers (được xác minh thông qua [BTC Relay](http://btcrelay.org)), [RANDAO](https://github.com/randao/randao), hoặc [Oraclize](http://www.oraclize.it/)).

