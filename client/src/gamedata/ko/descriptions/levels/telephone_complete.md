이 예는 단순해 보일 수 있지만, `tx.origin`을 `msg.sender`와 혼동하면 피싱 스타일의 공격으로 이어질 수 있습니다. 자세한 내용은 [이 글](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/)을 참고하세요.

가능한 공격 예시는 아래와 같습니다.

1) `tx.origin`을 사용해 누구의 토큰을 전송할지 결정합니다. 예:

```
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```
2) 공격자는 피해자가 토큰 컨트랙트의 transfer 함수를 호출하도록 악성 컨트랙트에 자금을 보내게 합니다. 예:

```
function () payable {
token.transfer(attackerAddress, 10000);
}
```

3) 이 상황에서 tx.origin은 피해자의 주소가 되고(msg.sender는 악성 컨트랙트 주소), 그 결과 피해자의 토큰이 공격자에게 전송됩니다.