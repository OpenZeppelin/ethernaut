Congratulations - you found a complementary signature!

It can be surprising that ECDSA signatures come in pairs. If you're interested in the math, it may help to note:
 - signature generation involves choosing a random value `k` and computing an elliptic curve point `P`.
 - almost any other random value, including `-k` would also lead to a valid signature.
 - the [the elliptic curve (secp256k1n)](https://en.bitcoin.it/wiki/Secp256k1) is symmetric so `-k` would produce the closely related point `-P`.
 - roughly speaking, we can think of the paired signatures as negatives of each other.
 - for this particular curve, `s` is calculated using the modulus `n = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141`
 - `n - s` is the negative of `s` in this setting, similar to how "negative 1 o'clock" would be 11 o'clock
 - since there is no cryptographic reason to have duplicate signatures, the convention (implemented by the [OpenZeppelin ECDSA library](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/ECDSA.sol)) is to only accept the one with the smaller `s`.

It is also advisable to identify conflicting transactions with the nonce rather than the signature.