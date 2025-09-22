Overflow rất phổ biến trong solidity và phải được kiểm tra bằng các câu lệnh điều khiển như:
```
if(a + c > a) {
  a = a + c;
}
```

Một lựa chọn dễ dàng hơn là sử dụng thư viện SafeMath của OpenZeppelin tự động kiểm tra overflow trong tất cả các toán tử toán học. Mã kết quả trông như thế này:
```
a = a.add(c);
```
Nếu có overflow, mã sẽ revert.