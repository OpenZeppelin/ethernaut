使用`delegatecall` 是很危险的, 而且历史上已经多次被用于进行 attack vector. 使用它, 你对合约相当于在说 "看这里, -其他合约- 或是 -其它库-, 来对我的状态为所欲为吧". 代理对你合约的状态有完全的控制权. `delegatecall` 函数是一个很有用的功能, 但是也很危险, 所以使用的时候需要非常小心.


请参见 [The Parity Wallet Hack Explained](https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7) 这篇文章, 他详细解释了这个方法是如何窃取三千万美元的.
