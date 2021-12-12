&nbsp;
#### 游戏机制
这个游戏使用主合约 `Ethernaut.sol` 来管理玩家进度, 代理玩家和 `Level.sol` 互动. 每一关的合约会产生一个实例供玩家操作, 攻破, 摧毁, 修复等等. 玩家请求一个实例, 操作之后返回,然后将会被评判完成度. 请求和提交实例都是通过每一关界面上的按钮. 当这个 app 从 `Ethernaut.sol` 取回实例时, 会把它包装在 `TruffleContract` 对象中, 然后暴露在浏览器的控制台里. 尝试第一关来看看怎么玩这个游戏.


&nbsp;
#### 使用浏览器控制台
大多数的游戏互动时通过浏览器的控制台: `Dev Tools -> Console`. 打开控制台然后输入这个命令:
```
help()
```
可以得到一个列表, 包含了被这个游戏放入控制台的对象和函数.
鉴于多数的互动是异步的, 我们推荐使用Chrome v62 并且使用 `async`/`await` 关键词, 所以相比于使用:
```
getBalance(player)
> PROMISE
```

我们推荐使用 await/async, 你可以这样使用:
```
await getBalance(player)
> "1.11002387"
```

&nbsp;
#### 控制台之外
有些关起需要在控制台之外的操作. 比如, 用 solidity 写一些代码, 部署合约在网络上, 然后攻击实例. 这可以通过很多方式完成, 比如: 
1) 使用 Remix 写代码并部署在相应的网络上 参见 [Remix Solidity IDE](https://remix.ethereum.org/).
2) 设置一个本地 truffle 项目, 开发并部署攻击合约. 参见 [Truffle Framework](http://truffleframework.com/).

&nbsp;
#### 疑难杂症
有的时候, app 或者 MetaMask 插件会有点问题, 特别是当你转换网络和解锁时. 如果你遇到什么莫名其妙的问题, 尝试刷新 app, 多次刷新. 重启 MetaMask 插件, 甚至是重启浏览器. 
如果你发现其他问题, 欢迎提交给我们 ethernaut@zeppelin.solutions
