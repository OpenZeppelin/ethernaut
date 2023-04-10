Para evitar ataques de reentrada ao retirar fundos do seu contrato, use o [padrão Checks-Effects-Interactions](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern) sabendo que `call` só retornará `false` sem interromper o fluxo de execução. Soluções como [ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard) ou [PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment) também pode ser usadas.

`transfer` e `send` não são mais soluções recomendadas, pois podem potencialmente quebrar contratos após o hard fork de Istambul [Fonte 1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/) [Fonte 2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742).

Sempre assuma que o destinatário dos fundos que você está enviando pode ser outro contrato, não apenas um endereço normal. Portanto, ele pode executar o código em seu método de `fallback payable` e *reentrar* seu contrato, possivelmente estragar seu estado/lógica.

A reentrada é um ataque comum. Você deve estar sempre preparado para isso!

&nbsp;
#### The DAO Hack

O famoso hack DAO usou a reentrância para extrair uma grande quantidade de ether do contrato da vítima. Veja [15 lines of code that could have prevented The DAO Hack](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942).
