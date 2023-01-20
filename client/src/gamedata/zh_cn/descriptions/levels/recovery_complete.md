
合约地址是确定性的，由 `keccack256(address, nonce)` 计算，其中`address` 是合约的地址（或创建交易的以太坊地址），`nonce` 是衍生合约发起的交易数量 （或交易随机数，用于常规交易）。  

正因为如此，人们可以将ether发送到一个预先确定的地址（没有私钥），然后在该地址创建一个合约来恢复以太币。 这是一种在不持有私钥的情况下（危险地）存储ether的不直观且有些隐秘的方式。 

Martin Swende 的一篇 [博客文章](http://martin.swende.se/blog/Ethereum_quirks_and_vulns.html) 详细介绍了这方面的潜在用例。

如果您要应用此技术，请确保您不会错过nonce，否则您的资金将永远丢失。


