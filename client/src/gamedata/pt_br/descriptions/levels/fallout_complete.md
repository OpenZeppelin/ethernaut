Isso foi demasiado fácil, não achou? Os contratos do mundo real devem ser muito mais seguros do que isso e, portanto, deve ser muito mais difícil hackeá-los, certo?

Bem... nem sempre.

A história de Rubixi é um caso muito conhecido no ecossistema Ethereum. A empresa mudou seu nome de 'Dynamic Pyramid' para 'Rubixi', mas de alguma forma eles não renomearam o método construtor de seu contrato:

```
contract Rubixi {
  address private owner;
  function DynamicPyramid() { owner = msg.sender; }
  function collectAllFees() { owner.transfer(this.balance) }
  ...
```

Isso permitiu que o atacante chamasse o antigo construtor, obtendo a propriedade do contrato e assim roubando alguns fundos. Sim, grandes erros podem ser cometidos na smartcontratland.