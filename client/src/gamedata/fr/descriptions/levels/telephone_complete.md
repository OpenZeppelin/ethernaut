Bien que cet exemple puisse être simple, confondre `tx.origin` avec `msg.sender` peut conduire à des attaques de type phishing, telles que [celle-ci](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/). 

Un exemple d'attaque possible est décrit ci-dessous.

1) Utilisez `tx.origin` pour déterminer les jetons de qui transférer, par ex.

```
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```
2) L'attaquant fait que la victime envoye des fonds à un contrat malveillant qui appelle la fonction de transfert du contrat de jeton, par ex.

```
function () payable {
  token.transfer(attackerAddress, 10000);
}
```

3) Dans ce scénario, `tx.origin` sera l'adresse de la victime (tandis que `msg.sender` sera l'adresse du contrat malveillant), ce qui entraînera le transfert des fonds de la victime à l'attaquant.
