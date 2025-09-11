Хоча цей приклад може бути простим, плутанина з `tx.origin` та `msg.sender` може призвести до атак типу "фішинг", таких як [ця](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/).

Приклад можливої атаки наведено нижче.

1) Використовуйте `tx.origin` для визначення, чиї токени перевести, наприклад:

```
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```
2) Атакуючий змушує жертву надіслати кошти зловмисному контракту, який викликає функцію переводу контракту токенів, наприклад:

```
function () payable {
  token.transfer(attackerAddress, 10000);
}
```

3) У цьому сценарії `tx.origin` буде адресою жертви (поки `msg.sender` буде адресою зловмисного контракту), що призведе до переказу коштів від жертви до атакуючого.
