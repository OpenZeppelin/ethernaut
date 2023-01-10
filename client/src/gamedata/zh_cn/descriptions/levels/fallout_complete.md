这很白痴是吧? 真实世界的合约必须安全的多, 难以入侵的多, 对吧?

实际上... 也未必.

Rubixi的故事在以太坊生态中非常知名. 这个公司把名字从 'Dynamic Pyramid' 改成 'Rubixi' 但是不知道怎么地, 他们没有把合约的 constructor 方法也一起更名:

```
contract Rubixi {
  address private owner;
  function DynamicPyramid() { owner = msg.sender; }
  function collectAllFees() { owner.transfer(this.balance) }
  ...
```

这让攻击者可以调用旧合约的constructor 然后获得合约的控制权, 然后再获得一些资产. 是的. 这些重大错误在智能合约的世界是有可能的.
