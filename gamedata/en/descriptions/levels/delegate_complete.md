Usage of `delegatecall` is particularly risky and has been used as an attack vector on multiple historic hacks. With it, your contract is practically saying "here, -other contract- or -other library-, do whatever you want with my state". Delegates have complete access to your contract's state. The `delegatecall` function is a powerful feature, but a dangerous one, and must be used with extreme care.


Please refer to the [The Parity Wallet Hack Explained](https://blog.zeppelin.solutions/on-the-parity-wallet-multisig-hack-405a8c12e8f7) article for an accurate explanation of how this idea was used to steal 30M USD.

