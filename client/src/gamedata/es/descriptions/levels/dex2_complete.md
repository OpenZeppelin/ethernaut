Como hemos visto repetidamente, la interacción entre contratos puede ser una fuente de algún comportamiento inesperado.

El hecho de que un contrato pretenda implementar la [especificación ERC20](https://eips.ethereum.org/EIPS/eip-20) no significa que sea digno de confianza.

Algunos tokens se desvían de la especificación ERC20 al no devolver un valor booleano de sus métodos de `transfer`. Consulte [Missing return value bug - At least 130 tokens affected](https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca).

Otros tokens ERC20, especialmente los diseñados por usuarios maliciosos, podrían comportarse de manera más maliciosa.

Si diseñas un DEX donde cualquiera pueda publicar sus propios tokens sin el permiso de una autoridad central, entonces el correcto funcionamiento del DEX podría depender de la interacción del contrato del DEX y los contratos de tokens los tokens que se publiquen.