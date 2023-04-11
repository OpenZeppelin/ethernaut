Você pode usar o modificador de função `view` em uma interface para evitar modificações de estado. O modificador `pure` também impede que as funções modifiquem o estado.

Certifique-se de ler a [documentação do Solidity](http://solidity.readthedocs.io/en/develop/contracts.html#view-functions) e aprender suas ressalvas.

Uma maneira alternativa de resolver esse nível é criar uma função `view` que retorne resultados diferentes dependendo dos dados de entrada, mas não modifique o estado, por exemplo `gasleft()`.