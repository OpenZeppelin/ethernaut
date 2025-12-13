
Địa chỉ hợp đồng là xác định và được tính bằng `keccak256(address, nonce)` trong đó `address` là địa chỉ của hợp đồng (hoặc địa chỉ ethereum đã tạo giao dịch) và `nonce` là số lượng hợp đồng mà hợp đồng tạo ra đã tạo (hoặc nonce giao dịch, cho các giao dịch thông thường).

Vì điều này, người ta có thể gửi ether đến một địa chỉ được xác định trước (không có khóa riêng) và sau đó tạo hợp đồng tại địa chỉ đó để khôi phục ether. Đây là một cách không trực quan và phần nào bí mật để (nguy hiểm) lưu trữ ether mà không cần giữ khóa riêng.

Một [bài đăng blog](https://swende.se/blog/Ethereum_quirks_and_vulns.html) thú vị của Martin Swende mô tả chi tiết các trường hợp sử dụng tiềm năng của điều này.

Nếu bạn sẽ triển khai kỹ thuật này, hãy đảm bảo bạn không bỏ lỡ nonce, hoặc tiền của bạn sẽ bị mất mãi mãi. 


