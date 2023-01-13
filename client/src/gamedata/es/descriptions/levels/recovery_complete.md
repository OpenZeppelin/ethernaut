Las direcciones de los contratos son deterministas y se calculan mediante `keccak256(address, nonce)` donde el `address` es la dirección del contrato (o la dirección ethereum que creó la transacción) y `nonce` es el número de contratos que el contrato en sí ha generado (o el nonce de la transacción, para transacciones regulares).

Debido a esto, uno puede enviar ether a una dirección predeterminada (que no tiene clave privada) y luego crear un contrato en esa dirección que recupera el ether. Esta es una forma no intuitiva y algo secreta de almacenar (peligrosamente) ether sin tener una clave privada.

Un [blog post](https://swende.se/blog/Ethereum_quirks_and_vulns.html) de Martin Swende detalla posibles casos de uso de esto.

Si vas a implementar esta técnica, asegúrate de no perder el nonce, o tus fondos se perderán para siempre.