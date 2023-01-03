要用 solidity 去產生隨機數是有點小困難的. 目前還沒有一個簡單的方法可以直接達成，而且你在智能合約中做的所有事情都是公開可見的，包括本地變數和被標記為私有的狀態變數。礦工可以透過控制區塊的雜湊值、時間戳、或是是否包括某個交易，去左右產生出來的隨機數或者其它資料。

想要獲得密碼學上的隨機數,你可以使用 [Chainlink VRF](https://docs.chain.link/docs/get-a-random-number)，它使用預言機，LINK token，和一個鏈上合約來檢驗這是不是真的是一個隨機數。

一些其它的選項包括使用比特幣區塊的標頭(block headers)，經過下面幾個驗證過 [BTC Relay](http://btcrelay.org))，[RANDAO](https://github.com/randao/randao)，或是 [Oraclize](http://www.oraclize.it/)。
