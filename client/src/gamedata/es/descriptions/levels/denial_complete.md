Ese nivel demuestra que las llamadas externas a contratos desconocidos puede crear vectores para ataques DOS si un monto específico de gas no está especificado.

Si está utilizando una `call` de bajo nivel, para continuar con la ejecución en caso de que una llamada externa haga revert, asegúrese de especificar una cantía de gas fijo. Por ejemplo, `call.gas (100000) .value ()`.

Por lo general, se debe seguir el patrón de [checks-effects-interactions](http://solidity.readthedocs.io/en/latest/security-considerations.html#use-the-checks-effects-interactions-pattern) para evitar ataques de reentrancy, puede haber otras circunstancias (como múltiples llamadas externas al final de una función) donde pueden surgir problemas como este.

* Nota *: Una `CALL` externa puede utilizar como máximo 63/64 del gas disponible actualmente
en el momento de ejecutar `CALL`. Por lo tanto, dependiendo de la cantidad de gas que se requiera para
completar una transacción, una transacción de gas suficientemente alto (es decir, una tal
que 1/64 del gas es capaz de completar los códigos de operación restantes en la llamada principal) se puede usar para mitigar este ataque en particular.