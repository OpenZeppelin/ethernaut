Ưu điểm của việc tuân theo mẫu UUPS là có proxy tối thiểu để triển khai. Proxy hoạt động như lớp lưu trữ nên bất kỳ thay đổi trạng thái nào trong hợp đồng triển khai thường không tạo ra tác dụng phụ cho các hệ thống sử dụng nó, vì chỉ logic được sử dụng thông qua delegatecalls.

Điều này không có nghĩa là bạn không nên đề phòng các lỗ hổng có thể bị khai thác nếu chúng ta để hợp đồng triển khai không được khởi tạo.

Đây là phiên bản đơn giản hóa một chút của những gì thực sự đã được phát hiện sau nhiều tháng phát hành mẫu UUPS.

Bài học: không bao giờ để hợp đồng triển khai không được khởi tạo ;)

Nếu bạn quan tâm đến những gì đã xảy ra, hãy đọc thêm [tại đây](https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680).