この例は簡単かもしれませんが、`tx.origin`と`msg.sender`を混同すると、[この](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/)ようなフィッシング攻撃を受ける可能性があります。

想定される攻撃の例を以下に示します。

1. `tx.origin` を使って、誰のトークンを転送するかを決定します。

```
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```

2. 攻撃者は被害者にトークンコントラクトの transfer 関数を呼び出す悪意のあるコントラクトに資金を送らせます。

```
function () payable {
  token.transfer(attackerAddress, 10000);
}
```

3. このシナリオでは、`tx.origin` が被害者のアドレスになり、`msg.sender` が悪意のある契約者のアドレスになります。その結果、資金は被害者から攻撃者に転送されます。
