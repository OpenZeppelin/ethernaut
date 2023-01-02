這個例子比較簡單，如果沒有搞清楚 `tx.origin` 和 `msg.sender` 的差異，可能會導致釣魚攻擊，比說如[這個](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/). 

下面描述了一個可能的攻擊。

1) 使用 `tx.origin` 來決定轉移誰的代幣，例如：

```
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```

1) 攻擊者讓受害者轉移轉資產到一個惡意合約，這個惡意合約會呼叫代幣合約的 transfer 函式把受害者的資產轉移到惡意合約，例如：

```
function () payable {
  token.transfer(attackerAddress, 10000);
}
```

3) 在這個情況下，`tx.origin` 是受害者的地址 (同時間 `msg.sender` 是惡意合約的地址)，這會導致受害者的資產被轉移到攻擊者的手上.
