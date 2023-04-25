Como vimos várias vezes, a interação entre contratos pode ser uma fonte de comportamento inesperado.

Só porque um contrato afirma implementar a [especificação ERC20](https://eips.ethereum.org/EIPS/eip-20) não significa que seja digno de confiança.

Alguns tokens se desviam da especificação ERC20 por não retornar um valor booleano de seus métodos `transfer`. Consulte [Missing return value bug - At least 130 tokens affected](https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca).

Outros tokens ERC20, especialmente aqueles projetados por concorrentes, podem se comportar de maneira mais maliciosa.

Se você criar uma DEX onde qualquer pessoa possa listar seus próprios tokens sem a permissão de uma autoridade central, a corretude do DEX pode depender da interação do contrato DEX e dos contratos do token sendo negociados.