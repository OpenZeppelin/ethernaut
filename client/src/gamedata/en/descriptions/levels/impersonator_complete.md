Congratulations! You've successfully unlocked the secrets of the elliptic curve signatures!

As described in [EIP-2](https://eips.ethereum.org/EIPS/eip-2), allowing values of `0 < s < secp256k1n` in our verification logic, as is currently the case, opens a signature malleability concern. One can take any signature, flip the `s` value from `s` to `secp256k1n - s`, change the `v` value (27 -> 28, 28 -> 27), and the resulting signature would still recover the same signer.

It is important to use safe implementations unless you know exactly what you are doing. Check the [OpenZeppelin implementation](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/448efeea6640bbbc09373f03fbc9c88e280147ba/contracts/utils/cryptography/ECDSA.sol#L128-L154) to learn how to use ecrecover safely.