Eso fue facil, ¿no? Los contratos del mundo real deben ser mucho más seguros que esto y, por lo tanto, ¿debe ser mucho más difícil piratearlos, verdad?

Bueno ... No del todo.

La historia de Rubixi es un caso muy conocido en el ecosistema Ethereum. La compañía cambió su nombre de 'Dynamic Pyramid' a 'Rubixi' pero de alguna manera no cambiaron el nombre del método constructor de su contrato:

```
contrato Rubixi {
 address private owner;
 function DynamicPyramid() {owner = msg.sender;}
 function collectAllFees() {owner.transfer(this.balance)}
 ...
```

Esto permitió al atacante llamar al antiguo constructor y reclamar la propiedad del contrato y robar algunos fondos. Sí. Se pueden cometer grandes errores en smartcontractland.
