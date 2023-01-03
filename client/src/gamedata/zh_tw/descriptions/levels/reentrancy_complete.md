為了防止轉移資產時發生重入攻擊，使用 [Checks-Effects-Interactions 模式](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern) 注意  `call` 只會回傳 false 而會不中斷執行。也可以使用其它保護方案包含説 [ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard) 或 [PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment)。

在 Istanbul 硬分叉之後，`transfer` 和 `send` 不再被推薦使用，因為它們可能會對合約造成潛在的風險，參考 [來源1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/) [來源2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742)。

任何時候都要假設資產的接受方可能是另一個合約，而不是一個普通的地址(EOA)。因此，它有可能執行了它的 payable fallback 之後又「重新進入」你的合約，這可能會把你合約狀態、邏輯搞到爆炸。

重入攻擊是一種常見的攻擊。你得對相關攻擊做好準備！

&nbsp;
#### The DAO 駭入事件

著名的 The DAO 駭入事件使用了重入攻擊，從受害合約中竊取了大量的 ether。參見 [15 lines of code that could have prevented TheDAO Hack](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942)。