这一关利用了 EVM 不会验证一个数组的 ABI-encoded 长度和他真实的payload的问题.

并且他利用了数组长度的算数下溢, 通过扩大数组到整个 `2^256` 的存储区域. 然后用户就可以更改所有合约的storage了.

这两个漏洞都是受这个启发 [Underhanded coding contest](https://medium.com/@weka/announcing-the-winners-of-the-first-underhanded-solidity-coding-contest-282563a87079)
