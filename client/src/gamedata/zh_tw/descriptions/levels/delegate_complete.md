使用 `delegatecall` 是風險蠻高的行為，而且過去的多次攻擊中，它常常是被利用的攻擊向量。如果用了它，你的合約根本是在說「欸欸！看這裡，其它合約/函式函式庫，想要對我的狀態怎麼玩弄都可以喔」。被委派的實例(delegate)對你合約的狀態有完整的權限。`delegatecall` 函式是一個非常強大的工具，但是同時也十分危險，在使用的時候需要非常的小心。


請參見 [The Parity Wallet Hack Explained](https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7) 這篇文章，它詳細解釋了當初如何透過這個方法去竊取三千萬美元。