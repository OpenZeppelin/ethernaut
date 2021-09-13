As we've repeatedly seen, interaction between contracts can be a source of unexpected behavior.

Just because a contract claims to implement the [ERC20 spec](https://eips.ethereum.org/EIPS/eip-20) does not mean it's trust worthy.

Some tokens deviate from the ERC20 spec by not returning a boolean value from their `transfer` methods. See [Missing return value bug - At least 130 tokens affected](https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca).

Other ERC20 tokens, especially those designed by adversaries could behave more maliciously.

If you design a DEX where anyone could list their own tokens without the permission of a central authority, then the correctness of the DEX could depend on the interaction of the DEX contract and the token contracts being traded.
