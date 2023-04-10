Isso foi meio bobo, não foi? Os contratos do mundo real devem ser muito mais seguros do que isso e, portanto, deve ser muito mais difícil hackeá-los, certo?

Então... Não é bem assim.

A história da Rubixi é um caso muito conhecido no ecossistema Ethereum. A empresa mudou seu nome de 'Dynamic Pyramid' para 'Rubixi', mas eles acabaram não renomearam o método constructor do contrato:

```
contract Rubixi {
  address private owner;
  function DynamicPyramid() { owner = msg.sender; }
  function collectAllFees() { owner.transfer(this.balance) }
  ...
```

Isso permitiu que o hacker chamasse o antigo construtor e reivindicasse a posse do contrato e roubasse alguns fundos. Isso mesmo. Grandes erros podem ser cometidos na smartcontractlândia.
