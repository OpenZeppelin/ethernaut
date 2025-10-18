Tebrikler, `Stake` makinesini kırdın!

Dış kontratlara yapılan low-level çağrılarda, çağrının revert edip etmediğini anlamak için dönüş değerlerini doğru şekilde doğrulamak çok önemlidir.

Daha fazla bilgi için [EEA EthTrust [S] Check External Calls Return](https://entethalliance.github.io/eta-registry/security-levels-spec.html#req-1-check-return) gereksinimine bakabilir ve dış ERC-20 tokenlarıyla etkileşimde her zaman [SafeERC20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/utils/SafeERC20.sol) kullanabilirsin.