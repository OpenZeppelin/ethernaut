In this level you have a DEX pool with a special functionality, the `sweepToken` function. This is a very common function to retrieve tokens stucked in contract that have been mistakenly sent to the contract. Our DEX pool operates with an `underlying` token that can't be swept because of security in the DEX pool, any other token can be swept.

The underlying token is an instance of the DET token implemented in `DoubleEntry` contract definition and the DEX holds 100 units of it. Additionally the DEX also holds 100 units of `LegacyToken LGT` which is unexpectedly related to `DoubleEntry`.

The `DoubleEntry` DET implements a models of a [Forta's agent](https://docs.forta.network/en/latest/) which is here for educational purposes and doesn't represent the actual design of it. Forta is the first runtime intelligence network on the security and health of Web3 core infrastructure and dApps.

An important notice is that the `DoubleEntry` DET token is deployed behind a [`TransparentUpgradeableProxy`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.2.0/contracts/proxy/TransparentUpgradeableProxy.sol).

Your goal is to succeed **in order** to:
- Have `Agent` not being called again when calling `delegateTransfer` function.
- Sweep all DET tokens from DEX.

Things that might help:
- How to upgrade contract implementations behind a proxy ?
- How does a double entry point work for a token contract ?
