Mục tiêu của cấp độ này là bạn phải hack hợp đồng [DEX](https://en.wikipedia.org/wiki/Decentralized_exchange) cơ bản bên dưới và đánh cắp tiền bằng cách thao túng giá.

Bạn sẽ bắt đầu với 10 token của `token1` và 10 của `token2`. Hợp đồng DEX bắt đầu với 100 của mỗi token.

Bạn sẽ thành công trong cấp độ này nếu bạn quản lý để rút hết ít nhất 1 trong 2 token từ hợp đồng, và cho phép hợp đồng báo cáo giá "xấu" của tài sản.

&nbsp;
### Lưu ý nhanh
Thông thường, khi bạn thực hiện swap với token ERC20, bạn phải `approve` hợp đồng để chi tiêu token của bạn. Để phù hợp với cú pháp của trò chơi, chúng tôi đã thêm phương thức `approve` vào chính hợp đồng. Vì vậy hãy thoải mái sử dụng `contract.approve(contract.address, <uint amount>)` thay vì gọi token trực tiếp, và nó sẽ tự động phê duyệt chi tiêu hai token với số lượng mong muốn. Hãy thoải mái bỏ qua hợp đồng `SwappableToken` nếu không.

&nbsp;
Những điều có thể hữu ích:
* Giá của token được tính như thế nào?
* Phương thức `swap` hoạt động như thế nào?
* Làm thế nào để `approve` một giao dịch của ERC20?
* Có nhiều hơn một cách để tương tác với hợp đồng!
* Remix có thể hữu ích
* "At Address" làm gì?
