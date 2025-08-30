정말 어처구니없었죠? 실제 컨트랙트는 이것보다 훨씬 안전하고 해킹하기도 훨씬 어려울 겁니다. 그렇죠?

글쎄요... 꼭 그렇지만은 않습니다.

Rubixi의 이야기는 이더리움 생태계에서 매우 잘 알려진 사례입니다. 이 회사는 이름을 'Dynamic Pyramid'에서 'Rubixi'로 바꿨지만, 어째서인지 컨트랙트의 생성자(constructor) 메서드 이름은 바꾸지 않았습니다:

```
contract Rubixi {
  address private owner;
  function DynamicPyramid() { owner = msg.sender; }
  function collectAllFees() { owner.transfer(this.balance) }
  ...
```

이 때문에 공격자는 예전 생성자를 호출하여 컨트랙트의 소유권을 주장하고 자금을 훔칠 수 있었습니다. 네, 스마트 컨트랙트의 세계에서는 이렇게 큰 실수가 일어나곤 합니다.
