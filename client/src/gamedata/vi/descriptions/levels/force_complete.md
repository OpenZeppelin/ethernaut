Trong solidity, để một hợp đồng có thể nhận ether, hàm fallback phải được đánh dấu `payable`.

Tuy nhiên, không có cách nào để ngăn kẻ tấn công gửi ether đến hợp đồng bằng cách tự hủy. Do đó, điều quan trọng là không dựa vào bất biến `address(this).balance == 0` cho bất kỳ logic hợp đồng nào.
