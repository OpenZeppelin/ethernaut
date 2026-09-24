Una pequeña DAO tiene un pequeño tesoro, protegido detrás de una sola regla: quien llame a `executeProposal` necesita tener al menos el 50% del supply del token de gobernanza. Empiezas sin nada de ese token, y ni comprarlo ni recibirlo como regalo es una opción.

Resulta que el token de gobernanza soporta flash loans, y cobra la misma comisión de 0.3% que cobra Uniswap V2 en un flash swap. Te dieron un pequeño balance inicial, muy lejos de alcanzar el quorum si simplemente lo mantuvieras.

Completa este nivel drenando el tesoro.

&nbsp;
Cosas que pueden ayudar
* Qué garantiza realmente un flash loan: un balance durante la duración de una transacción, nada más
* Por qué los sistemas de gobernanza reales hacen checkpoint del poder de voto en vez de leer `balanceOf()` en vivo
* La comisión no es gratis: averigua de dónde tiene que salir antes de pedir prestado
* Vas a necesitar un contrato para este nivel: quien presta el flash loan llama de vuelta a `msg.sender`, lo cual solo tiene sentido si ahí hay código para ejecutar
