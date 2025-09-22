Cấp độ này có một `CryptoVault` với chức năng đặc biệt, hàm `sweepToken`. Đây là một hàm phổ biến được sử dụng để lấy lại token bị kẹt trong hợp đồng. `CryptoVault` hoạt động với một token `underlying` không thể bị quét, vì nó là thành phần logic cốt lõi quan trọng của `CryptoVault`. Bất kỳ token nào khác đều có thể bị quét.

Token underlying là một phiên bản của token DET được triển khai trong định nghĩa hợp đồng `DoubleEntryPoint` và `CryptoVault` nắm giữ 100 đơn vị của nó. Ngoài ra `CryptoVault` cũng nắm giữ 100 `LegacyToken LGT`.

Trong cấp độ này bạn nên tìm ra lỗi ở đâu trong `CryptoVault` và bảo vệ nó khỏi bị rút hết token.

Hợp đồng có một hợp đồng `Forta` nơi bất kỳ người dùng nào cũng có thể đăng ký hợp đồng `detection bot` của riêng mình. Forta là một mạng giám sát phi tập trung, dựa trên cộng đồng để phát hiện các mối đe dọa và bất thường trên DeFi, NFT, quản trị, cầu nối và các hệ thống Web3 khác một cách nhanh chóng nhất có thể. Nhiệm vụ của bạn là triển khai một `detection bot` và đăng ký nó trong hợp đồng `Forta`. Việc triển khai bot sẽ cần đưa ra cảnh báo chính xác để ngăn chặn các cuộc tấn công tiềm ẩn hoặc khai thác lỗi.

Những điều có thể hữu ích:
- Double entry point hoạt động như thế nào cho hợp đồng token?
