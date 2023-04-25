Endereços de contrato são determinísticos e são calculados por `keccak256(address, nonce)` onde `address` é o endereço do contrato (ou endereço ethereum que criou a transação) e `nonce` é o número de contratos que o gerador de contratos criou (ou o nonce da transação, para transações regulares).

Por causa disso, pode-se enviar ether para um endereço pré-determinado (que não possui chave privada) e posteriormente criar um contrato nesse endereço que recupera o ether. Esta é uma maneira não intuitiva e um tanto secreta de (perigosamente) armazenar ether sem manter uma chave privada.

Uma [postagem](https://swende.se/blog/Ethereum_quirks_and_vulns.html) interessante de Martin Swende detalha possíveis casos de uso disso.

Se você for implementar essa técnica, certifique-se de não perder o `nonce`, ou seus fundos serão perdidos para sempre.