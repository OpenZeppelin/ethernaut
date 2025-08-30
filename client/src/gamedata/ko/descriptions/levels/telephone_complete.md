이 예제는 간단할 수 있지만, `tx.origin`과 `msg.sender`를 혼동하면 [이러한](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/) 피싱 형태의 공격으로 이어질 수 있습니다.

가능한 공격의 예시가 아래에 설명되어 있습니다.

1.  `tx.origin`을 사용하여 누구의 토큰을 전송할지 결정합니다.

```
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```

2.  공격자는 피해자가 토큰 컨트랙트의 `transfer` 함수를 호출하는 악의적인 컨트랙트로 자금을 보내도록 유도합니다.

```
function () payable {
  token.transfer(attackerAddress, 10000);
}
```

3.  이 시나리오에서 `tx.origin`은 피해자의 주소가 되고(`msg.sender`는 악의적인 컨트랙트의 주소가 됨), 결과적으로 자금은 피해자로부터 공격자에게 전송됩니다.
