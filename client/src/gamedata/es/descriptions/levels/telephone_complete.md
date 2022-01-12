Si bien este ejemplo puede ser simple, confundir `tx.origin` con `msg.sender` puede conducir a ataques de phishing, como [este](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/).

A continuación se describe un ejemplo de un posible ataque.

1) Utilizas `tx.origin` para determinar qué tokens transferir, p. Ej.

```
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```

2) El atacante consigue que la víctima envíe fondos a un contrato malicioso que llama a la función de transferencia del contrato de token, p.

```
function () payable {
  token.transfer(attackerAddress, 10000);
}
```

3) En este escenario, `tx.origin` será la dirección de la víctima (mientras que `msg.sender` será la dirección del contrato malicioso), lo que hará que los fondos se transfieran de la víctima al atacante.