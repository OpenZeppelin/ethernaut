Ese nivel aprovecha del hecho que la EVM no válida el tamaño de un ABI-encoded array contra su payload efectivo.

Adicionalmente, aprovecha de un underflow aritmético del tamaño del array, expandiendo los límites del array al la totalidad del área de storage de `2^256`. Ese momento es cuando el usuario es capaz de modificar el storage del contrato por completo.

Ambas vulnerabilidades están inspiradas en el [Underhanded coding contest](https://medium.com/@weka/announcing-the-winners-of-the-first-underhanded-solidity-coding-contest-282563a87079) de 2017.