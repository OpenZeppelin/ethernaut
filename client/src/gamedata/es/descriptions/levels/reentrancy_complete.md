Para evitar ataques de reentrancy al sacar fondos de tu contrato, utiliza el patron de [Checks-Effects-Interactions](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern) teniendo en cuenta que `call` solo devolverá falso sin interrumpir la ejecución. También se pueden utilizar soluciones como [ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard) o [PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment).

`transfer` y `send` ya no son soluciones recomendadas, ya que pueden romper algunos contratos después del hardfork de Instanbul [Fuente 1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/), [Fuente 2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742).

Siempre asume que el destinatario de los fondos que está enviando puede ser otro contrato, no únicamente una dirección regular. Por lo tanto, puede ejecutar código en su método fallback y *volver a ingresar* en tu contrato, posiblemente arruinando su estado/lógica.

Los ataques de reentrancy son muy común. ¡Siempre debes estar preparado para ellos!

&nbsp;
#### El DAO hack

El famoso hack de DAO empleó reentrancy para extraer una gran cantidad de ethers del contrato de la víctima. Consulta [15 líneas de código que podrían haber evitado TheDAO Hack](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942).