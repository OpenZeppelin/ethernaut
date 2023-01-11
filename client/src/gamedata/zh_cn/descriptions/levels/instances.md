这一关可以帮助你初步了解如何体验这个游戏

#### 1. Set up MetaMask
If you don't have it already, install the [MetaMask browser extension](https://metamask.io/) (in Chrome, Firefox, Brave or Opera on your desktop machine).
Set up the extension's wallet and use the network selector to point to the preferred network in the top left of the extension's interface. Alternatively you can use the UI button to switch between networks. If you select an unsupported network, the game will notify you and bring you to the default Goerli testnet.

#### 2. 打开浏览器的控制台
打开浏览器控制台: `Tools > Developer Tools`.

你应该可以看到一些关于游戏的简单的信息，其中一个是你的玩家地址。这在游戏中很重要，你可以通过以下命令查看你的玩家地址:
```
player
```

请注意警告和报错，因为他们可能提供了有关游戏的重要信息。

#### 3. 使用控制台协助

你可以通过以下命令来得知你的账户余额:
```
getBalance(player)
```
###### NOTE: 展开promise可以看到真实数值, 即使他显示的是"pending". 如果你使用的是Chrome v62, 你可以使用 `await getBalance(player)` 用起来更舒爽.

很好！可以使用以下命令获得更多功能:
```
help()
```
这在游戏中非常方便.

#### 4. ethernaut 合约
在控制台中输入以下命令:
```
ethernaut
```

这个游戏的主要合约，你不需要通过控制台和他直接互动（因为这个应用已经替你做好了），但是如果你想，你还是可以做到。先尝试熟悉它，这是让你了解如何和游戏里其他合约互动的好方法。

然后让我们来展开 ethernaut 看看里面都有啥。

#### 5. 和 ABI 互动
`ethernaut` 是一个 `TruffleContract` 对象， 它包装了部署在区块链上的 `Ethernaut.sol` 合约.

除此之外，合约的 ABI 还提供了所有的 `Ethernaut.sol` 公开方法, 比如 `owner`. 比如输入以下命令:
```
ethernaut.owner()
```
######  如果你使用的是 Chrome v62, 可以使用 `await ethernaut.owner()`.
你可以看到这个 ethernaut 合约的所有者是谁, 当然不是你，哈哈 XD.

#### 6. 获得测试ether
To play the game, you will need test ether. The easiest way to get some testnet ether is via a valid faucet for your chosen network.

Once you see some coins in your balance, move on to the next step.

#### 7. 获得这个关卡的实例
当进行这个关卡的时候，你不直接和 ethernaut 合约互动。而是请求生成一个 **level instance** .为了完成这个步骤，你需要点击页面下方的蓝色按钮. 去点他点他点他，然后再回来!

Metamask会发送请求通过交易授权. 请通过请求, 然后你会在控制台看到一些信息. 注意这会在网络上部署一个新的合约，并且这需要一些时间, 所以请耐心等待!

#### 8. 检查合约
就像你刚才和 ethernaut 合约互动的那样, 你可以通过控制台输入 `contract` 变量名来观察这个合约的ABI.

#### 9. 和这个合约互动来完成关卡
来看看这个合约的 info 方法
```
contract.info()
```
###### 如果你使用的是 Chrome v62, 可以使用 `await contract.info()` .
你应该已经在合约内找到帮你通过关卡的东西了。
当你知道你已经完成了这个关卡，通过这个页面的橙色按钮提交合约。
这会将你的实例发送回给 ethernaut， 然后来判断你是否完成了任务。


##### 提示: 别忘了你总是可以查看 ABI!
