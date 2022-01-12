Puedes utilizar el modifier `view` en una interfaz para evitar modificaciones de estado. El modifier `pure` también evita que las funciones modifiquen el estado.
Asegúrate de leer la [documentación de Solidity](http://solidity.readthedocs.io/en/develop/contracts.html#view-functions) y aprendas sus advertencias.

Una forma alternativa de resolver este nivel es construir una función `view` que devuelva resultados diferentes dependiendo de los datos de entrada, pero que no modifique el estado, por ejemplo `gasleft()`.