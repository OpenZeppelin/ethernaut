Ngày nay, việc thanh toán cho các hoạt động DeFi là không thể, thực tế.

Một nhóm bạn đã khám phá ra cách giảm nhẹ chi phí thực hiện nhiều giao dịch bằng cách gộp chúng thành một giao dịch, vì vậy họ đã phát triển một hợp đồng thông minh để làm điều này.

Họ cần hợp đồng này có thể nâng cấp trong trường hợp mã chứa lỗi, và họ cũng muốn ngăn những người bên ngoài nhóm sử dụng nó. Để làm điều này, họ đã bỏ phiếu và chỉ định hai người với vai trò đặc biệt trong hệ thống:
Admin, người có quyền cập nhật logic của hợp đồng thông minh.
Owner, người kiểm soát whitelist các địa chỉ được phép sử dụng hợp đồng.
Các hợp đồng đã được triển khai, và nhóm đã được whitelist. Mọi người đều vui mừng vì thành tích của họ chống lại các thợ mỏ xấu.

Họ không biết rằng, tiền ăn trưa của họ đang gặp rủi ro...

&nbsp;
Bạn sẽ cần cướp ví này để trở thành admin của proxy.

&nbsp;
Những điều có thể hữu ích:
* Hiểu cách `delegatecall` hoạt động và cách `msg.sender` và `msg.value` hoạt động khi thực hiện một.
* Biết về các mẫu proxy và cách chúng xử lý các biến lưu trữ.
