¡Felicitaciones, has vulnerado la máquina `Stake`!

Al realizar llamadas de bajo nivel a contratos externos, es importante validar correctamente los valores de retorno para determinar si la llamada se revirtió.

Para más información, revisa el requisito [EEA EthTrust [S] Check External Calls Return](https://entethalliance.github.io/eta-registry/security-levels-spec.html#req-1-check-return), y usa siempre [SafeERC20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/utils/SafeERC20.sol) al interactuar con tokens ERC-20 externos.