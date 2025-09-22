Như cấp độ trước, `delegate` đề cập, việc sử dụng `delegatecall` để gọi
thư viện có thể rủi ro. Điều này đặc biệt đúng với các thư viện hợp đồng có
trạng thái riêng của chúng. Ví dụ này chứng minh tại sao từ khóa `library`
nên được sử dụng để xây dựng thư viện, vì nó ngăn các thư viện
lưu trữ và truy cập các biến trạng thái. 

