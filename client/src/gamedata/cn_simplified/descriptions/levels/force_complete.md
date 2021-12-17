在solidity中, 如果一个合约要接受 ether, fallback 方法必须设置为 `payable`.

但是, 并没有发什么办法可以阻止攻击者通过自毁的方法向合约发送 ether, 所以, 不要将任何合约逻辑基于  `address(this).balance == 0` 之上.
