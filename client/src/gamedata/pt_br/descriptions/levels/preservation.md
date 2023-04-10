Este contrato utiliza uma biblioteca para armazenar dois horários diferentes para dois
fusos horários. O construtor cria duas instâncias da biblioteca em cada vez
para armazenamento.

O objetivo deste nível é que você reivindique a posse da instância que lhe foi dada.

Coisas que podem ser úteis:
* Veja a documentação da Solidity sobre a função de baixo nível `delegatecall`,
  como funciona, como pode ser usado para delegar operações on-chain.
* Bibliotecas e quais implicações isso tem no escopo de execução.
* Compreender o que significa `delegatecall` preservar o contexto.
* Compreender como as variáveis ​​de armazenamento são armazenadas e acessadas.
* Compreender como funciona a conversão entre diferentes tipos de dados.