Stake é cofre para fazer stake de ETH nativo e ERC20 WETH, considerando o mesmo valor 1:1 dos tokens. Você pode drenar o contrato?

Para completar este nível, o estado do contrato deve atender às seguintes condições:

* O saldo em ETH do contrato `Stake` deve ser maior que 0.
* `totalStaked` deve ser maior que o saldo em ETH do contrato `Stake`.
* Você deve ser um staker.
* Seu saldo estacado deve ser 0.

Coisas que podem ser úteis:
* A especificação [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md)
* Os contratos da [OpenZeppelin](https://github.com/OpenZeppelin/zeppelin-solidity/tree/master/contracts)
