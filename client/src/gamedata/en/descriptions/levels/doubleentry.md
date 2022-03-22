In this level you have a DEX pool with a special functionality, the `sweepToken` function. This is a very common function to retrieve tokens stucked in contract. Our DEX pool operates with an `underlying` token that can't be swept because of security in the DEX pool, any other token can be swept.

The underlying token is an instance of the DET token implemented in `DoubleEntry` contract definition and the DEX holds 100 units of it. Additionally the DEX also holds 100 of `LegacyToken LGT` which is unexpectedly related to `DoubleEntry`.

The `DoubleEntry` DET implements a models of a [Forta's agent](https://forta.org/) which is here for educational purposes and doesn't represent the actual functioning design of it.

An importante notice is that the `DoubleEntry` DET token is deployed behind a [`TransparentUpgradeableProxy`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.2.0/contracts/proxy/TransparentUpgradeableProxy.sol).

Your goal is to suceed **in order** to:
- Have `Agent` not being called again when calling `delegateTransfer` function.
- Sweep all LTT tokens from DEX.

Things that might help:
- How to upgrade contract implementations behind a proxy.
- How does a double entry point works for a token contract ?
