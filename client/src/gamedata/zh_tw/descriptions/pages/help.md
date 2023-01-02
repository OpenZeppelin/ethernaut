&nbsp;
#### 遊戲機制
這個遊戲使用主合約 `Ethernaut.sol` 來管理玩家進度，代理玩家和 `Level.sol` 互動。每一關的合約會產生一個實例供給玩家操作、攻擊、摧毀、修復等等。玩家會請求一個實例，操作之後在回傳，這個實力會被拿來評判是否有過關。請求和提交實例都是透過每一關畫面上的按鈕。當這個 app 從 `Ethernaut.sol` 取得實例時，會把它包裝在 `TruffleContract` 物件中，可以在瀏覽器的控制台裡存取到這個物件。用第一關來當遊戲教學，來看看怎麽玩這個遊戲。


&nbsp;
#### 使用瀏覽器控制台
大多數的時候，遊戲要透過瀏覽器的控制台來進行互動
`Dev Tools -> Console` 打開控制台然後輸入這個指令：
```
help()
```

可以看到一個列表，它們是遊戲放入控制台的物件和函式。
鑒於多數的互動是非同步的，我們推薦使用 Chrome v62 並且使用 `async`/`await` 關鍵字，所以相較於使用下面的操作然後再打開 promise

```
getBalance(player)
> PROMISE
```

我們更推薦使用 await/async，你可以這樣使用
```
await getBalance(player)
> "1.11002387"
```

&nbsp;
#### 控制台之外
有些關卡需要在控制台之外的操作。比如，用 Solidity 寫一些程式碼，部署合約在區塊鏈網路上，然後攻擊關卡實例。這可以透過很多方式完成，比如：
1) 使用 Remix 寫程式碼並部署在對應的網絡上，參見 [Remix Solidity IDE](https://remix.ethereum.org/)
2) 開一個本地 Truffle 專案，開發並部署攻擊合約，參見 [Truffle Framework](http://truffleframework.com/)

&nbsp;
#### 疑難雜癥
有的時候 app 或者 Metamask 擴充套件會有點問題，特別是在你轉換網絡(switch internet)和解鎖時。如果你遇到什麽莫名其妙的問題，嘗試重整 app，多次重整。重啟 Metamask 擴充套件，甚至是重啟瀏覽器。
如果你發現其它問題，歡迎回報給給我們 ethernaut@zeppelin.solutions
