El objetivo de este nivel es piratear el contrato básico de [DEX](https://en.wikipedia.org/wiki/Decentralized_exchange) a continuación y robar los fondos mediante la manipulación de precios.

Comenzarás con 10 tokens de `token1` y 10 de` token2`. El contrato DEX comienza con 100 de cada token.

Tendrás éxito en este nivel si lograras agotar al menos 1 de los 2 tokens del contrato y permitir que el contrato informe un precio equivocado de los activos.

&nbsp;
### Nota rápida
Normalmente, cuando realizas un intercambio con un token ERC20, debes autorizar mediante `approve` el contrato para gastar tus tokens. Para mantener la sintaxis del juego, simplemente hemos agregado el método `approve` al contrato. Así que siéntete libre de usar `contract.approve (contract.address, <uint amount>)` en lugar de llamar a los tokens directamente, y automáticamente se aprobará gastar los dos tokens por la cantidad deseada. De lo contrario, no dudes en ignorar el contrato de `SwappableToken`.

&nbsp;
Cosas que pueden ayudar:
* ¿Cómo se calcula el precio del token?
* ¿Cómo funciona el método `swap`?
* ¿Cómo se aprueba  una transacción de un ERC20?
* ¡Hay más de una forma de interactuar con un contrato!
* Remix podría ayudar
