在 Solidity 中，如果一個合約要能夠接收 ether，它的 fallback 方法必須設為 `payable`。

然而，並沒有什麽辦法可以阻止攻擊者透過自毀的方式，向合約發送 ether，所以，不要將任何合約邏輯建立在  `address(this).balance == 0` 之上。