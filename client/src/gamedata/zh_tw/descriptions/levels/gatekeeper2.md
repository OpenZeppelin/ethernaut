守衛帶來了一些新的挑戰，同樣地，你需要注冊為參賽者才能通過這一關。

&nbsp;
可能會有用的資訊
* 回想一下你從上一個守衛那學到了什麽，第一道門是一樣的
* 第二道門的 `assembly` 關鍵字可以讓合約去存取 Solidity 非原生的功能。參見 [這裡](http://solidity.readthedocs.io/en/v0.4.23/assembly.html)。在這道門的 `extcodesize` 函式，可以用來得到給定地址的合約程式碼長度，你可以在 [黃皮書](https://ethereum.github.io/yellowpaper/paper.pdf) 的第七章學到更多相關的資訊。
*  `^` 字元在第三個門裡是位元運算 (XOR)，在這裡是為了應用另一個常見的位元運算手段 (參見 [這裡](http://solidity.readthedocs.io/en/v0.4.23/miscellaneous.html#cheatsheet))。Coin Flip 關卡也是一個想要破這關很好的參考資料。
