恭喜你！你成功解锁了椭圆曲线签名的秘密！

正如 [EIP-2](https://eips.ethereum.org/EIPS/eip-2) 中所描述的，在我们的验证逻辑中允许 `0 < s < secp256k1n` 的值，如今的情况会引发签名可塑性问题。任何人都可以将任何签名的 `s` 值从 `s` 翻转为 `secp256k1n - s`，更改 `v` 值（27 -> 28，28 -> 27），结果签名仍然可以恢复相同的签名者。

重要的是，除非你确切知道自己在做什么，否则要使用安全的实现。查看 [OpenZeppelin 实现](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/448efeea6640bbbc09373f03fbc9c88e280147ba/contracts/utils/cryptography/ECDSA.sol#L128-L154) 以了解如何安全地使用 ecrecover。