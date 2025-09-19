Bu örnek basit görünse de, tx.origin ile msg.sender’ı karıştırmak phishing tarzı saldırılara yol açabilir, örneğin [bu](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/). makalede anlatıldığı gibi.

Aşağıda olası bir saldırı örneği özetlenmiştir.

1) `tx.origin` kullanılarak kimin tokenlarının transfer edileceği belirlenir, örneğin:

```
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```
2) Saldırgan, kurbanı kötü amaçlı bir kontrata para göndermeye ikna eder; o kontrat da token kontratının transfer fonksiyonunu çağırır, örneğin: 

```
function () payable {
  token.transfer(attackerAddress, 10000);
}
```

3) Bu durumda, `tx.origin` işlem başlatan (kurbanın) adresi olurken `msg.sender` kötü niyetli kontratın adresi olacaktır. Sonuç olarak fonlar kurbandan saldırgana aktarılır.
