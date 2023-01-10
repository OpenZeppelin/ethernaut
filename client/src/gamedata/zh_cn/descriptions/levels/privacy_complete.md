在以太坊链上, 没有什么是私有的. private 关键词只是 solidity 中人为规定的一个结构. Web3 的 `getStorageAt(...)` 可以读取 storage 中的任何信息, 虽然有些数据读取的时候会比较麻烦. 因为 一些优化的技术和原则, 这些技术和原则是为了尽可能压缩 storage 使用的空间.

这不会比这个关卡中暴露的复杂太多. 更多的信息, 可以参见 "Darius" 写的这篇详细的文章: [How to read Ethereum contract storage](https://medium.com/aigang-network/how-to-read-ethereum-contract-storage-44252c8af925) 
