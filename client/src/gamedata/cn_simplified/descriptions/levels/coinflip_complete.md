通过solidity产生随机数没有那么容易. 目前没有一个很自然的方法来做到这一点, 而且你在智能合约中做的所有事情都是公开可见的, 包括本地变量和被标记为私有的状态变量. 矿工可以控制 blockhashes, 时间戳, 或是是否包括某个交易, 这可以让他们根据他们目的来左右这些事情.


想要获得密码学上的随机数,你可以使用
[Chainlink VRF](https://docs.chain.link/docs/get-a-random-number), 它使用预言机, LINK token, 和一个链上合约来检验这是不是真的是一个随机数.

一些其它的选项包括使用比特币block headers (通过验证 [BTC Relay](http://btcrelay.org)), [RANDAO](https://github.com/randao/randao), 或是 [Oraclize](http://www.oraclize.it/)).

