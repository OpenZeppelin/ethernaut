O objetivo deste nível é hackear o contrato básico [DEX](https://en.wikipedia.org/wiki/Decentralized_exchange) abaixo e roubar os fundos por meio de manipulação de preços.

Você começará com 10 tokens de `token1` e 10 de `token2`. O contrato DEX começa com 100 de cada token.

Você terá passará deste nível se conseguir drenar pelo menos 1 dos 2 tokens do contrato e permitir que o contrato relate um preço "ruim" dos ativos.

Nota rápida
Normalmente, quando você faz uma troca com um token ERC20, você deve "aprovar" o contrato para gastar seus tokens por você. Para manter a sintaxe do jogo, acabamos de adicionar o método `approve` ao próprio contrato. Portanto, sinta-se à vontade para usar `contract.approve(contract.address, <uint amount>)` em vez de chamar os tokens diretamente, e ele aprovará automaticamente o gasto dos dois tokens no valor desejado. Sinta-se à vontade para ignorar o contrato `SwappableToken` caso contrário.

Coisas que podem ser úteis:
* Como é calculado o preço do token?
* Como funciona o método `swap`?
* Como você :aprova" uma transação de um ERC20?
* Há mais de uma maneira de interagir com um contrato!
* Remix pode ajudar
* O que faz "At Address"?