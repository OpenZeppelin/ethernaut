Cấp độ này sẽ hướng dẫn bạn những điều cơ bản về cách chơi trò chơi.

&nbsp;
#### 1. Thiết lập MetaMask
Nếu bạn chưa có thì hãy cài đặt [tiện ích mở rộng trình duyệt MetaMask](https://metamask.io/) (trong Chrome, Firefox, Brave hoặc Opera trên máy tính để bàn của bạn).
Thiết lập ví của tiện ích mở rộng và sử dụng bộ chọn mạng để trỏ đến mạng ưa thích ở phía trên bên trái giao diện của tiện ích mở rộng. Ngoài ra, bạn có thể sử dụng nút UI để chuyển đổi giữa các mạng. Nếu bạn chọn mạng không được hỗ trợ, trò chơi sẽ thông báo cho bạn và đưa bạn đến mạng thử nghiệm Sepolia mặc định.

#### 2. Mở bảng điều khiển của trình duyệt
Mở bảng điều khiển của trình duyệt của bạn: `Tools > Developer Tools`.

Bạn sẽ thấy một vài thông báo từ trò chơi. Một trong số họ sẽ nêu địa chỉ người chơi của bạn. Điều này sẽ rất quan trọng trong trò chơi! Bạn luôn có thể xem địa chỉ người chơi của mình bằng cách nhập lệnh sau:

`player`

Hãy để ý đến các cảnh báo và lỗi vì chúng có thể cung cấp thông tin quan trọng trong quá trình chơi trò chơi.

#### 3. Sử dụng trợ giúp của bảng điều khiển

Bạn cũng có thể xem số dư ether hiện tại của mình bằng cách nhập:

`getBalance(player)`

###### LƯU Ý: Mở rộng lời hứa để xem giá trị thực tế, ngay cả khi nó ghi "đang chờ xử lý". Nếu đang sử dụng Chrome v62, bạn có thể sử dụng `await getBalance(player)` để có trải nghiệm bảng điều khiển rõ ràng hơn.

Tuyệt vời! Để xem bạn có những chức năng tiện ích nào khác trong loại bảng điều khiển:

`help()`

Những thứ này sẽ cực kỳ tiện dụng trong quá trình chơi game.

#### 4. Hợp đồng ethernaut
Nhập lệnh sau vào bảng điều khiển:

`ethernaut`

Đây là hợp đồng thông minh chính của trò chơi. Bạn không cần phải tương tác trực tiếp với nó thông qua bảng điều khiển (vì ứng dụng này sẽ làm điều đó cho bạn) nhưng bạn có thể làm điều đó nếu muốn. Chơi đùa với đối tượng này bây giờ là một cách tuyệt vời để tìm hiểu cách tương tác với các hợp đồng thông minh khác của trò chơi.

Hãy tiếp tục và mở rộng đối tượng ethernaut để xem có gì bên trong.

#### 5. Tương tác với ABI
`ethernaut` là một đối tượng `TruffleContract` bao bọc hợp đồng `Ethernaut.sol` đã được triển khai trên blockchain.

Trong số những thứ khác, ABI của hợp đồng tiết lộ tất cả các phương thức công khai của `Ethernaut.sol`, chẳng hạn như `chủ sở hữu`. Nhập lệnh sau đây chẳng hạn:

`ethernaut.owner()` hoặc `await ethernaut.owner()` nếu bạn đang sử dụng Chrome v62.

Bạn có thể xem chủ sở hữu của hợp đồng ethernaut là ai.

#### 6. Nhận ether thử nghiệm
Để chơi trò chơi, bạn sẽ cần ether thử nghiệm. Cách dễ nhất để nhận một số ether testnet là thông qua một vòi hợp lệ cho mạng bạn đã chọn.

Khi bạn thấy một số xu trong số dư của mình, hãy chuyển sang bước tiếp theo.

#### 7. Lấy một phiên bản cấp độ
Khi chơi một cấp độ, bạn không tương tác trực tiếp với hợp đồng ethernaut. Thay vào đó, bạn yêu cầu nó tạo một **phiên bản cấp độ** cho bạn. Để làm như vậy, hãy nhấp vào nút "Nhận phiên bản mới" ở cuối trang. Hãy làm điều đó ngay bây giờ và quay lại!

Bạn sẽ được MetaMask nhắc nhở ủy quyền giao dịch. Làm như vậy và bạn sẽ thấy một số thông báo trong bảng điều khiển. Lưu ý rằng quá trình này đang triển khai một hợp đồng mới trong chuỗi khối và có thể mất vài giây, vì vậy hãy kiên nhẫn khi yêu cầu các phiên bản cấp mới!

#### 8. Kiểm tra hợp đồng
Giống như bạn đã làm với hợp đồng ethernaut, bạn có thể kiểm tra ABI của hợp đồng này thông qua bảng điều khiển bằng cách sử dụng biến `hợp đồng`.

#### 9. Tương tác với hợp đồng để hoàn thành cấp độ
Hãy xem phương thức thông tin của cấp độ `contract.info()` hoặc `await Contract.info()` nếu bạn đang sử dụng Chrome v62.
Bạn nên có tất cả những gì bạn cần để hoàn thành cấp độ trong hợp đồng.
Khi bạn biết mình đã hoàn thành cấp độ, hãy gửi hợp đồng bằng nút gửi ở cuối trang.
Thao tác này sẽ gửi phiên bản của bạn trở lại ethernaut, điều này sẽ xác định xem bạn đã hoàn thành nó chưa.


##### Mẹo: Đừng quên rằng bạn luôn có thể xem ABI của hợp đồng!
