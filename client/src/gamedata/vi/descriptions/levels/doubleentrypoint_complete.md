Chúc mừng!

Đây là trải nghiệm đầu tiên của bạn với [Forta bot](https://docs.forta.network/en/latest/).

Forta bao gồm một mạng phi tập trung của các nhà điều hành nút độc lập quét tất cả các giao dịch và thay đổi trạng thái theo từng khối để tìm các giao dịch bất thường và mối đe dọa. Khi phát hiện vấn đề, các nhà điều hành nút gửi cảnh báo cho người đăng ký về các rủi ro tiềm ẩn, cho phép họ hành động.

Ví dụ được trình bày chỉ dành cho mục đích giáo dục vì Forta bot không được mô hình hóa thành hợp đồng thông minh. Trong Forta, bot là một script mã để phát hiện các điều kiện hoặc sự kiện cụ thể, nhưng khi cảnh báo được phát ra, nó không kích hoạt các hành động tự động - ít nhất là chưa. Trong cấp độ này, cảnh báo của bot hiệu quả kích hoạt revert trong giao dịch, lệch khỏi thiết kế bot dự định của Forta.

Detection bot phụ thuộc nhiều vào triển khai cuối cùng của hợp đồng và một số có thể nâng cấp và phá vỡ tích hợp bot, nhưng để giảm thiểu điều đó, bạn thậm chí có thể tạo một bot cụ thể để tìm kiếm nâng cấp hợp đồng và phản ứng với nó. Tìm hiểu cách làm điều đó [tại đây](https://docs.forta.network/en/latest/quickstart/).

Bạn cũng đã trải qua một vấn đề bảo mật gần đây đã được phát hiện trong [hợp tác mới nhất của OpenZeppelin với giao thức Compound](https://compound.finance/governance/proposals/76).

Có token trình bày double entry point là một mẫu không tầm thường có thể ảnh hưởng đến nhiều giao thức. Điều này là do người ta thường giả định có một hợp đồng cho mỗi token. Nhưng lần này không phải vậy :) Bạn có thể đọc toàn bộ chi tiết về những gì đã xảy ra [tại đây](https://blog.openzeppelin.com/compound-tusd-integration-issue-retrospective/).
