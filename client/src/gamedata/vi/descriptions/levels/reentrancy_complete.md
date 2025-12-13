Để ngăn chặn các cuộc tấn công re-entrancy khi di chuyển tiền ra khỏi hợp đồng của bạn, hãy sử dụng mẫu [Checks-Effects-Interactions](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern) biết rằng `call` sẽ chỉ trả về false mà không làm gián đoạn luồng thực thi. Các giải pháp như [ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard) hoặc [PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment) cũng có thể được sử dụng.

`transfer` và `send` không còn là giải pháp được khuyến nghị vì chúng có thể phá vỡ hợp đồng sau hard fork Istanbul [Nguồn 1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/) [Nguồn 2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742).

Luôn giả định rằng người nhận tiền bạn đang gửi có thể là một hợp đồng khác, không chỉ là địa chỉ thông thường. Do đó, nó có thể thực thi mã trong phương thức fallback payable của nó và *tái nhập* hợp đồng của bạn, có thể làm rối tung trạng thái/logic của bạn.

Re-entrancy là một cuộc tấn công phổ biến. Bạn nên luôn chuẩn bị sẵn sàng cho nó!

&nbsp;
#### Vụ hack DAO

Vụ hack DAO nổi tiếng đã sử dụng reentrancy để trích xuất một lượng ether khổng lồ từ hợp đồng nạn nhân. Xem [15 dòng mã có thể ngăn chặn vụ hack DAO](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942).
