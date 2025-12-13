Cấp độ này khai thác thực tế rằng EVM không xác thực độ dài được mã hóa ABI của mảng so với payload thực tế của nó.

Ngoài ra, nó khai thác underflow số học của độ dài mảng, bằng cách mở rộng giới hạn của mảng đến toàn bộ vùng lưu trữ của `2^256`. Người dùng sau đó có thể sửa đổi tất cả lưu trữ hợp đồng.

Cả hai lỗ hổng đều được lấy cảm hứng từ [cuộc thi lập trình Underhanded 2017](https://medium.com/@weka/announcing-the-winners-of-the-first-underhanded-solidity-coding-contest-282563a87079)