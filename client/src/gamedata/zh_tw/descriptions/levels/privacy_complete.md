在以太坊上，資訊都是公開的，沒有什麽資訊是能夠被隱藏的。`private` 關鍵字只是 solidity 語言中，一個對於變數和函式封裝的的概念。使用 Web3 的 `getStorageAt(...)` 就可以讀取 storage 中的任何資料，雖然讀取有些資料的時候會比較麻煩，這是為了在盡可能壓縮 storage 使用空間的時候， solidity 用到了不少最佳化的技術。

但其實也不會比這個關卡中你遇到的問題複雜到哪裡去。更多的訊息，可以參見 Darius 寫的這篇超棒的文章: [How to read Ethereum contract storage](https://medium.com/aigang-network/how-to-read-ethereum-contract-storage-44252c8af925) 
