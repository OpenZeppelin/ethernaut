This level features a `CryptoVault` with special functionality, the `sweepToken` function. This is a common function to retrieve tokens stuck in a contract. The `CryptoVault` operates with an `underlying` token that can't be swept, being it an important core's logic component of the `CryptoVault`, any other token can be swept.

The underlying token is an instance of the DET token implemented in `DoubleEntryPoint` contract definition and the `CryptoVault` holds 100 units of it. Additionally the `CryptoVault` also holds 100 of `LegacyToken LGT`.

In this level you should figure out where the bug is in `CryptoVault` and protect it from being drained out of tokens.

The contract features a `Forta` contract where any user can register its own `Agent` contract. Forta is the first decentralized runtime intelligence network on the security and health of Web3 core infrastructure and dApps. Your job is to implement an `Agent` and register it in the `Forta` contract. The agent's implementation will need to raise correct alerts to prevent potential attacks or bug exploits.

Things that might help:
- How does a double entry point work for a token contract ?
