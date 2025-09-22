Việc sử dụng `delegatecall` đặc biệt rủi ro và đã được sử dụng làm vector tấn công trong nhiều vụ hack lịch sử. Với nó, hợp đồng của bạn thực tế đang nói "đây, -hợp đồng khác- hoặc -thư viện khác-, làm bất cứ điều gì bạn muốn với trạng thái của tôi". Các delegate có quyền truy cập hoàn toàn vào trạng thái hợp đồng của bạn. Hàm `delegatecall` là một tính năng mạnh mẽ, nhưng nguy hiểm, và phải được sử dụng với sự cẩn thận tối đa.


Vui lòng tham khảo bài viết [The Parity Wallet Hack Explained](https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7) để có giải thích chính xác về cách ý tưởng này được sử dụng để đánh cắp 30M USD.

