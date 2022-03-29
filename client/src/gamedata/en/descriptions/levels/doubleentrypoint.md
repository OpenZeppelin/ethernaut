This level features a `CryptoVault` with special functionality, the `sweepToken` function. This is a common function to retrieve tokens stuck in a contract. The `CryptoVault` operates with an `underlying` token that can't be swept, being it an important core's logic component of the `CryptoVault`, any other token can be swept.

The underlying token is an instance of the DET token implemented in `DoubleEntryPoint` contract definition and the `CryptoVault` holds 100 units of it. Additionally the `CryptoVault` also holds 100 of `LegacyToken LGT`.

A model of a [Forta agent](https://docs.forta.network/en/latest/) which is here for educational purposes and doesn't represent the actual functioning design of it is presented but not used by any contract yet. Forta is the first decentralized runtime intelligence network on the security and health of Web3 core infrastructure and dApps. Your job is to implement `Agent` inside `DoubleEntryPoint` contract.

An important notice is that the `DoubleEntryPoint` DET token is deployed behind a [`TransparentUpgradeableProxy`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.2.0/contracts/proxy/TransparentUpgradeableProxy.sol) contract.

Your goal is to succeed **in order** to:
- Have `Agent` integrated in every `delegateTransfer` function call so that a notification is sent everytime the function is called.
- Sweep all DET tokens from `CryptoVault`.

Things that might help:
- How to upgrade contract implementations behind a proxy.
- How does a double entry point work for a token contract ?

