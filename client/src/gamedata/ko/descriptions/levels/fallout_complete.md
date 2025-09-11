조금 멍청했죠? 실제 계약들은 이보다 훨씬 더 안전해야 하고, 해킹도 훨씬 더 어려워야 하지 않나요?

하지만… 꼭 그렇진 않습니다.

Rubixi 이야기는 이더리움 생태계에서 매우 잘 알려진 사례입니다. 이 회사는 이름을 ‘Dynamic Pyramid’에서 ‘Rubixi’로 변경했지만, 컨트랙트의 생성자 메서드 이름은 변경하지 않았습니다:

```
contract Rubixi {
  address private owner;
  function DynamicPyramid() { owner = msg.sender; }
  function collectAllFees() { owner.transfer(this.balance) }
  ...
}
```

이로 인해 공격자는 이전 생성자 메서드를 호출해 컨트랙트의 소유권을 주장하고 자금을 탈취할 수 있었습니다. 네, 스마트컨트랙트 세계에서도 큰 실수를 저지를 수 있습니다.