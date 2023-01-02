這很蠢對吧? 你是不是覺得，真實世界的合約一定更安全，更難以入侵，對不對？

餒...其實不一定耶。

Rubixi 的故事在以太坊生態系中非常有名。 這個公司把名字從 「Dynamic Pyramid」 改成 「Rubixi」 但是不知道怎樣，它們沒有把合約的 constructor 方法也一起更改：

```
contract Rubixi {
  address private owner;
  function DynamicPyramid() { owner = msg.sender; }
  function collectAllFees() { owner.transfer(this.balance) }
  ...
```

這讓攻擊者可以呼叫舊合約的 constructor 然後獲得合約的所有權，然後再偷得一些資產。對啊所以，這些重大錯誤在智能合約的世界是有可能會發生的喔。
