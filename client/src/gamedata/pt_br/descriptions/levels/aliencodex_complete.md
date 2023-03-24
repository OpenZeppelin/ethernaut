Este nível explora o fato de que a EVM não valida o comprimento codificado de um vetor versus sua carga útil real.

Além disso, ele explora o `underflow` aritmético do tamanho do array, expandindo os limites do array para toda a área de armazenamento de `2^256`. O usuário pode então modificar todo o armazenamento do contrato.

Ambas as vulnerabilidades são inspiradas no [Underhanded coding contest](https://medium.com/@weka/announcing-the-winners-of-the-first-underhanded-solidity-coding-contest-282563a87079) de 2017.