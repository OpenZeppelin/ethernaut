La próxima vez, esos amigos solicitarán una auditoría antes de depositar dinero en un contrato. ¡Felicitaciones!

Con frecuencia, se recomienda utilizar contratos de proxy para lograr posibilidad de actualización y reducir el coste del gas. Sin embargo, los desarrolladores deben tener cuidado de no introducir colisiones de storage, como aprendido en este nivel.

Además, iterar sobre operaciones que consumen ETH puede generar problemas si no se maneja correctamente. Incluso si se gasta ETH, `msg.value` seguirá siendo el mismo, por lo que el desarrollador debe realizar un seguimiento manual de la cantidad real restante en cada iteración. Esto también puede dar lugar a problemas cuando se emplea un patrón de llamadas múltiples, ya que realizar múltiples `delegatecall`s a una función que parece segura por sí sola podría conducir a transferencias no deseadas de ETH, por el hecho de que las `delegatecall`s mantienen el `msg.value` original enviado al contrato.

¡Pasa al siguiente nivel cuando estás listo!