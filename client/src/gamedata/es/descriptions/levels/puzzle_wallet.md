Nowadays, paying for DeFi operations is impossible, fact.

A group of friends discovered how to slightly decrease the cost of performing multiple transactions by batching them in one transaction, so they developed a smart contract for doing this. 

They needed this contract to be upgradeable in case the code contained a bug, and they also wanted to prevent people from outside the group from using it. To do so, they voted and assigned two people with special roles in the system:
The admin, which has the power of updating the logic of the smart contract.
Hoy en día, pagar por operaciones DeFi es imposible, es un hecho.

Un grupo de amigos descubrió cómo disminuir ligeramente el costo de realizar múltiples transacciones al agruparlas en una sola transacción, por lo que desarrollaron un contrato inteligente para hacer esto.

Necesitaban que este contrato se pudiera actualizar en caso de que el código contuviera un error, y también querían evitar que personas ajenas al grupo lo usaran. Para ello, votaron y asignaron a dos personas con roles especiales en el sistema:
El admin, que tiene el poder de actualizar la lógica del contrato.
El owner, que controla la lista blanca de direcciones autorizadas a utilizar el contrato.
Los contratos se deployaron y el grupo se incluyó en la lista blanca. Todos aplaudieron sus logros contra los mineros malvados.

Poco sabían, su dinero estaba en riesgo ...

&nbsp;
Deberá secuestrar esta billetera para convertirte en el administrador del proxy.

&nbsp;
Cosas que podrían ayudar:
* Comprender cómo funcionan las `delegatecall`s y cómo se comportan `msg.sender` y `msg.value` al realizar una.
* Conocer los patrones de proxy y la forma en que manejan las variables de storage.