Stake es seguro para hacer staking de ETH nativo y del ERC20 WETH, considerando el mismo valor 1:1 de los tokens. ¿Puedes vaciar el contrato?

Para completar este nivel, el estado del contrato debe cumplir las siguientes condiciones:

- El balance de ETH del contrato `Stake` tiene que ser mayor que 0.
- `totalStaked` debe ser mayor que el balance de ETH del contrato `Stake`.
- Debes ser un staker.
- Tu balance en stake debe ser 0.

Cosas que podrían ser útiles:

- La especificación [ERC-20](https://github.com/ethereum/ercs/blob/master/ERCS/erc-20.md).
- Los [contratos de OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts).