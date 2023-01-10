這一關可以幫助你初步了解這個遊戲要怎麼玩。

&nbsp;
#### 1. 設定 Metamask
如果你還沒有安裝 Metamask，可以去 [Metamask browser extension](https://metamask.io/) 安裝 (適用於桌面Chrome，Firefox，Brave 或者 Opera)。
設定好 Metamask 的錢包，並且在 Metamask 界面的左上方選擇「Rinkeby test network」測試網。

&nbsp;
#### 2. 打開瀏覽器的控制台
打開瀏覽器控制台: `Tools > Developer Tools`.

你應該可以看到一些關於遊戲的訊息，其中一個是你的「玩家地址」。這地址在遊戲中很重要，你可以在控制台輸入以下指令查看你的玩家地址：

```
player
```

請注意警告和錯誤，因為它們可能在遊戲進行中提供了有關遊戲的重要訊息。

&nbsp;
#### 3. 使用控制台輔助指令

你可以透過以下指令來得知你當下的賬戶餘額：

```
getBalance(player)
```

###### NOTE: 展開 promise 可以看到真實數值，即使它顯示的是"pending". 如果你使用的是 Chrome v62，你可以使用 `await getBalance(player)` 會呈現更乾淨的使用體驗。

讚啦！如果想要知道更多輔助指令可以在控制台輸入下面指令：
```
help()
```
這在遊戲中超有用的喔。

&nbsp;
#### 4. ethernaut 合約
在控制台中輸入以下指令：
```
ethernaut
```

這是這個遊戲的主合約，你不需要透過控制台和它直接互動(因為這個網頁/應用程式已經幫你做好了)，但是如果你想要的話，你還是可以跟他直接互動。現在先試玩看看這個合約，應該是一個讓你了解如何和遊戲裡其它合約互動的好方法。

然後讓我們來展開 ethernaut 看看裡面有什麼。

&nbsp;
#### 5. 和 ABI 互動
`ethernaut` 是一個 `TruffleContract` 物件， 它包裝了部署在區塊鏈上的 `Ethernaut.sol` 合約。

除此之外，合約的 ABI 還提供了所有的 `Ethernaut.sol` 公開方法(public methods)，比如說 `owner`. 試試看輸入以下指令：
```
ethernaut.owner()
```

######  如果你使用的是 Chrome v62，可以使用 `await ethernaut.owner()`
你可以看到這個 ethernaut 合約的擁有者是誰，不過當然不是你，ㄏㄏ (σﾟ∀ﾟ)σ。

&nbsp;
#### 6. 獲得測試網 ether
為了玩這個遊戲，你需要一些 ether。最簡單可以拿到測試網 ether 的方法是透過 [this](https://faucet.rinkeby.io/)，[this](https://faucets.chain.link/rinkeby) 或 [this faucet](https://faucet.paradigm.xyz/)。

一旦你在你的餘額中有一些 ether 之後，就可以進行下一步。

&nbsp;
#### 7. 獲得這個關卡實例
當你再玩一個關卡的時候，你其實不是直接和 ethernaut 合約互動。而是請求 ethernaut 合約產生一個 **關卡實例(level instance)** .為了取得關卡實例，你需要點擊頁面下方的藍色按鈕。現在快過去按他，然後再回來！

Metamask 會跳出要求你給該筆交易授權。授權過後，你會在控制台看到一些訊息。注意喔！這是在區塊鏈上部署一個新的合約，所以可能需要花一些時間，因此請耐心等待一下吧！

&nbsp;
#### 8. 檢查合約
就像你剛才和 ethernaut 合約互動的那樣，你可以透過控制台輸入 `contract` 變數來檢查這個合約的 ABI。

&nbsp;
#### 9. 和這個合約互動來完成關卡
來看看這個關卡合約的 info 方法
```
contract.info()
```

###### 如果你使用的是 Chrome v62，可以使用 `await contract.info()`

你應該已經在合約裡面找到所有你破關所需的資料和工具了。當你覺得你已經完成了這關，按一下這個頁面的橘色按鈕就可以提交合約。這會將你的實例發送回給 ethernaut， 然後就可以用來判斷你是否完成了任務。

##### 小提示: 別忘了你什麼時候都可以查看合約的 ABI 喔！