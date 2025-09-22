Mặc dù ví dụ này có thể đơn giản, việc nhầm lẫn `tx.origin` với `msg.sender` có thể dẫn đến các cuộc tấn công kiểu phishing, chẳng hạn như [này](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/).

Một ví dụ về cuộc tấn công có thể được mô tả dưới đây.

1) Sử dụng `tx.origin` để xác định token của ai để chuyển, ví dụ:

```
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```
2) Kẻ tấn công khiến nạn nhân gửi tiền đến một hợp đồng độc hại gọi hàm transfer của hợp đồng token, ví dụ:

```
function () payable {
  token.transfer(attackerAddress, 10000);
}
```

3) Trong trường hợp này, `tx.origin` sẽ là địa chỉ của nạn nhân (trong khi `msg.sender` sẽ là địa chỉ của hợp đồng độc hại), dẫn đến việc chuyển tiền từ nạn nhân sang kẻ tấn công.
