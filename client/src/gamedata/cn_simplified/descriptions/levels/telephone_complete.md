这个例子比较简单, 混淆 `tx.origin` 和 `msg.sender` 会导致 phishing-style 攻击, 比如[this](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/). 

下面描述了一个可能的攻击.

1) 使用 `tx.origin` 来决定转移谁的token, 比如.

```
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```
2) 攻击者通过调用合约的 transfer 函数是受害者向恶意合约转移资产, 比如

```
function () payable {
  token.transfer(attackerAddress, 10000);
}
```

3) 在这个情况下, `tx.origin` 是受害者的地址 ( `msg.sender` 是恶意协议的地址), 这会导致受害者的资产被转移到攻击者的手上.
