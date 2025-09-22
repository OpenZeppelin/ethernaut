Cấp độ này chứng minh rằng các lệnh gọi bên ngoài đến các hợp đồng không xác định vẫn có thể
tạo ra các vector tấn công từ chối dịch vụ nếu không chỉ định một lượng gas cố định.

Nếu bạn đang sử dụng `call` cấp thấp để tiếp tục thực thi trong trường hợp lệnh gọi bên ngoài revert, hãy đảm bảo rằng bạn chỉ định một khoản gas cố định. Ví dụ `call.gas(100000).value()`.

Thông thường người ta nên tuân theo mẫu [checks-effects-interactions](http://solidity.readthedocs.io/en/latest/security-considerations.html#use-the-checks-effects-interactions-pattern) để tránh các cuộc tấn công reentrancy, có thể có các trường hợp khác (như nhiều lệnh gọi bên ngoài ở cuối hàm) nơi các vấn đề như vậy có thể phát sinh.

*Lưu ý*: Một `CALL` bên ngoài có thể sử dụng tối đa 63/64 gas hiện có
tại thời điểm `CALL`. Do đó, tùy thuộc vào lượng gas cần thiết để
hoàn thành một giao dịch, một giao dịch có gas đủ cao (tức là một giao dịch như vậy
mà 1/64 gas có khả năng hoàn thành các opcode còn lại trong lệnh gọi cha) có thể được sử dụng để giảm thiểu cuộc tấn công cụ thể này.