為了防止合約的狀態被修改，你可以在函示的介面(interface)加上 `view` 修飾子。`pure` 修改器也可以防止韓式修改合約的狀態被篡改。
閱讀 [Solidity's documentation](http://solidity.readthedocs.io/en/develop/contracts.html#view-functions) 並瞭解相關的注意事項。

這一關的另一個解題方案是實作一個 view 函式，這個函式根據不同的輸入資料回傳不同的結果，但是不更改合約狀態，比如說 `gasleft()`。