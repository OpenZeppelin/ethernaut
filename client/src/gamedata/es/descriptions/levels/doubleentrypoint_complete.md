¡Felicitaciones!

Esta es la primer experiencia que tienes con un [Forta bot](https://docs.forta.network/en/latest/).

Forta comprende una red descentralizada de operadores de nodos independientes que escanean todas las transacciones y los cambios de estado bloque por bloque, en busca de amenazas y transacciones atípicas. Cuando se detecta un problema, los operadores de nodos envían alertas a los suscriptores sobre posibles riesgos, lo que les permite tomar medidas.

El presente ejemplo es solo para fines educativos, ya que el bot de Forta no está modelado dentro de smart contracts. En Forta, un bot es un script de código para detectar especificas condiciones o eventos, pero cuando una alerta es emitida, no activa acciones automáticas (al menos no todavía). En este nivel, la alerta del bot activó efectivamente una reversión en la transacción, desviándose de la intención del diseño de un bot de Forta. 

Los bots de detección dependen en gran parte de las implementaciones finales de los contratos y algunos pueden actualizarse y romper sus integraciones, pero para mitigar esto, incluso puedes crear un bot específico para buscar actualizaciones del contrato y reaccionar ante ellas. Aprenda cómo hacerlo [aquí](https://docs.forta.network/en/latest/quickstart/).

También has pasado por un problema de seguridad reciente que ha sido descubierto durante la última [colaboración de OpenZeppelin con el protocolo Compound](https://compound.finance/governance/proposals/76).

Tener tokens que presentan un doble punto de entrada es un patrón no trivial que puede afectar muchos protocolos. Esto es debido a que comunmente se asume tener un contrato por token. Pero esta vez no fue el caso :) Puedes leer todos los detalles de lo que ocurrió [aquí](https://blog.openzeppelin.com/compound-tusd-integration-issue-retrospective/).