Như chúng ta đã thấy nhiều lần, tương tác giữa các hợp đồng có thể là nguồn gốc của hành vi không mong đợi.

Chỉ vì một hợp đồng tuyên bố triển khai [đặc tả ERC20](https://eips.ethereum.org/EIPS/eip-20) không có nghĩa là nó đáng tin cậy.

Một số token lệch khỏi đặc tả ERC20 bằng cách không trả về giá trị boolean từ các phương thức `transfer` của chúng. Xem [Lỗi thiếu giá trị trả về - Ít nhất 130 token bị ảnh hưởng](https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca).

Các token ERC20 khác, đặc biệt là những token được thiết kế bởi kẻ thù có thể hành xử độc hại hơn.

Nếu bạn thiết kế một DEX nơi bất kỳ ai cũng có thể liệt kê token của riêng họ mà không cần sự cho phép của cơ quan trung ương, thì tính đúng đắn của DEX có thể phụ thuộc vào tương tác của hợp đồng DEX và các hợp đồng token được giao dịch.
