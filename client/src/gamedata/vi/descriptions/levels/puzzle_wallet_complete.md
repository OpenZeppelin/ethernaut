Lần sau, những người bạn đó sẽ yêu cầu kiểm toán trước khi gửi tiền vào hợp đồng. Chúc mừng!

Thường xuyên, việc sử dụng hợp đồng proxy được khuyến nghị cao để mang lại tính năng nâng cấp và giảm chi phí gas triển khai. Tuy nhiên, các nhà phát triển phải cẩn thận không để xảy ra va chạm lưu trữ, như được thấy trong cấp độ này.

Hơn nữa, lặp qua các thao tác tiêu thụ ETH có thể dẫn đến vấn đề nếu không được xử lý đúng cách. Ngay cả khi ETH được chi tiêu, `msg.value` sẽ vẫn giữ nguyên, vì vậy nhà phát triển phải theo dõi thủ công số tiền còn lại thực tế trong mỗi lần lặp. Điều này cũng có thể dẫn đến vấn đề khi sử dụng mẫu multi-call, vì thực hiện nhiều `delegatecall` đến một hàm trông an toàn có thể dẫn đến chuyển ETH không mong muốn, vì `delegatecall` giữ nguyên `msg.value` gốc được gửi đến hợp đồng.

Chuyển sang cấp độ tiếp theo khi bạn sẵn sàng!
