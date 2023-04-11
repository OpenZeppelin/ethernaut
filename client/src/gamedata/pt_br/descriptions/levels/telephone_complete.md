Embora este exemplo possa ser simples, confundir `tx.origin` com `msg.sender` pode levar a ataques do tipo phishing, como [este](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/).

Um exemplo de um possível ataque é descrito abaixo.

1) Use `tx.origin` para determinar de quem os tokens serão transferidos, por exemplo:

```
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```

2) O hacker faz com que a vítima envie fundos para um contrato malicioso que chama a função de transferência do contrato de token, por exemplo:

```
function () payable {
  token.transfer(attackerAddress, 10000);
}
```

3) Nesse cenário, `tx.origin` será o endereço da vítima (enquanto `msg.sender` será o endereço do contrato malicioso), resultando na transferência de fundos da vítima para o hacker.