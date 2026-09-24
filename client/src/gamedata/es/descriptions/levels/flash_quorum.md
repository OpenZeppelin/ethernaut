Una pequeña DAO tiene un pequeño tesoro, protegido detrás de una sola regla: quien llame a `executeProposal` necesita tener al menos el 50% del supply del token de gobernanza. Te dieron un pequeño balance inicial, muy lejos de alcanzar el quorum si simplemente lo mantuvieras, y ni comprar el resto ni recibirlo como regalo es una opción.

Completa este nivel drenando el tesoro.

&nbsp;
Cosas que pueden ayudar
* Revisa qué más puede hacer el token de gobernanza además de `transfer` y `approve`
* La comisión no es gratis: averigua de dónde tiene que salir antes de pedir prestado
* Vas a necesitar un contrato para este nivel: quien presta el flash loan llama de vuelta a `msg.sender`, lo cual solo tiene sentido si ahí hay código para ejecutar
