La ventaja de seguir un patrón UUPS es tener un proxy mínimo para deployar. El proxy actúa como capa de almacenamiento, por lo que cualquier modificación de estado en el contrato de implementación normalmente no produce efectos secundarios en los sistemas que lo utilizan, ya que solo se usa la lógica a través de delegatecalls.

Esto no significa que no debas estar atento a las vulnerabilidades que pueden usarse si dejamos un contrato de implementación sin inicializar.

Esta es una versión ligeramente simplificada de lo que realmente se descubrió después de meses del lanzamiento del patrón UUPS.

Conclusiones: nunca dejes los contratos de implementación sin inicializar ;)

Si estás interesado en lo que sucedió, puedes leer más [aquí](https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680).