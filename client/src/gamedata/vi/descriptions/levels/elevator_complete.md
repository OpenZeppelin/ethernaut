Bạn có thể sử dụng modifier hàm `view` trên một interface để ngăn chặn các thay đổi trạng thái. Modifier `pure` cũng ngăn các hàm thay đổi trạng thái.
Hãy đảm bảo bạn đọc [tài liệu Solidity](http://solidity.readthedocs.io/en/develop/contracts.html#view-functions) và tìm hiểu các lưu ý của nó.

Một cách khác để giải cấp độ này là xây dựng một hàm view trả về kết quả khác nhau tùy thuộc vào dữ liệu đầu vào nhưng không thay đổi trạng thái, ví dụ `gasleft()`.