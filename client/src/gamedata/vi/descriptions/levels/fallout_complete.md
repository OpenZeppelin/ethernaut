Điều đó thật ngớ ngẩn phải không? Các hợp đồng thực tế phải an toàn hơn nhiều so với điều này và vì vậy phải khó hack hơn nhiều phải không?

Chà... Không hẳn vậy.

Câu chuyện của Rubixi là một trường hợp rất nổi tiếng trong hệ sinh thái Ethereum. Công ty đã đổi tên từ 'Dynamic Pyramid' thành 'Rubixi' nhưng bằng cách nào đó họ không đổi tên phương thức constructor của hợp đồng:

```
contract Rubixi {
  address private owner;
  function DynamicPyramid() { owner = msg.sender; }
  function collectAllFees() { owner.transfer(this.balance) }
  ...
```

Điều này cho phép kẻ tấn công gọi constructor cũ và chiếm quyền sở hữu hợp đồng, và đánh cắp một số tiền. Vâng. Những sai lầm lớn có thể được thực hiện trong smartcontractland.
